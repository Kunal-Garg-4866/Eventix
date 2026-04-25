import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';
import { Society } from '../models/Society.js';
import { Notification } from '../models/Notification.js';

function normalizeRoll(r) {
  return String(r || '').trim().toLowerCase();
}

function uniqueRolls(rolls) {
  const set = new Set();
  for (const r of rolls) {
    const n = normalizeRoll(r);
    if (!n) return false;
    if (set.has(n)) return false;
    set.add(n);
  }
  return true;
}

export async function registerForEvent(req, res, next) {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can register' });
    }
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const existing = await Registration.findOne({ event: event._id, student: req.userId });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.eventType === 'solo') {
      const { name, rollNumber, email } = req.body;
      if (!name || !rollNumber || !email) {
        return res.status(400).json({ message: 'name, rollNumber, and email are required for solo events' });
      }
      const reg = await Registration.create({
        event: event._id,
        student: req.userId,
        email: String(email).trim().toLowerCase(),
        registrationType: 'solo',
        soloParticipant: { name, rollNumber },
        teamName: '',
        teamMembers: [],
      });
      await Notification.create({
        user: req.userId,
        message: `Successfully registered for event: ${event.title}`,
        type: 'registration',
      });
      const populated = await Registration.findById(reg._id).populate('event');
      return res.status(201).json({ registration: populated });
    }

    const { teamName, members, email } = req.body;
    if (!teamName || !Array.isArray(members) || members.length === 0 || !email) {
      return res.status(400).json({ message: 'teamName, members array, and email are required for team events' });
    }
    const teamMembers = members.map((m) => ({
      name: String(m.name || '').trim(),
      rollNumber: String(m.rollNumber || '').trim(),
    }));
    if (teamMembers.some((m) => !m.name || !m.rollNumber)) {
      return res.status(400).json({ message: 'Each member needs name and rollNumber' });
    }
    const count = teamMembers.length;
    if (count < event.teamSizeMin || count > event.teamSizeMax) {
      return res.status(400).json({
        message: `Team must have between ${event.teamSizeMin} and ${event.teamSizeMax} members`,
      });
    }
    const rolls = teamMembers.map((m) => m.rollNumber);
    if (!uniqueRolls(rolls)) {
      return res.status(400).json({ message: 'Duplicate roll numbers are not allowed' });
    }
    const reg = await Registration.create({
      event: event._id,
      student: req.userId,
      email: String(email).trim().toLowerCase(),
      registrationType: 'team',
      teamName,
      teamMembers,
      soloParticipant: {},
    });
    await Notification.create({
      user: req.userId,
      message: `Successfully registered for event: ${event.title}`,
      type: 'registration',
    });
    const populated = await Registration.findById(reg._id).populate('event');
    return res.status(201).json({ registration: populated });
  } catch (e) {
    next(e);
  }
}

export async function myRegistrations(req, res, next) {
  try {
    const list = await Registration.find({ student: req.userId })
      .populate({ path: 'event', populate: { path: 'society', select: 'name logo' } })
      .sort({ createdAt: -1 });
    res.json({ registrations: list });
  } catch (e) {
    next(e);
  }
}

export async function listEventRegistrations(req, res, next) {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const society = await Society.findById(event.society);
    if (!society || society.admin.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'You can only view registrations for your society events' });
    }
    const registrations = await Registration.find({ event: event._id })
      .populate('student', 'name email rollNumber')
      .sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (e) {
    next(e);
  }
}
