import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';
import { Society } from '../models/Society.js';
import { Notification } from '../models/Notification.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getRegistrationSuccessEmail } from '../utils/emailTemplates.js';

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
      
      // Send confirmation email and await to prevent hosting from killing background task
      const subject = `Registration Successful: ${event.title}`;
      const text = `Hi ${name}, you have successfully registered for ${event.title}.`;
      const html = getRegistrationSuccessEmail(event, name);
      await sendEmail(email, subject, text, html).catch((err) => console.error("Email error:", err));
      
      return res.status(201).json({ registration: populated });
    }

    const { teamName, members, email } = req.body;
    if (!teamName || !Array.isArray(members) || members.length === 0 || !email) {
      return res.status(400).json({ message: 'teamName, members array, and email are required for team events' });
    }
    const teamMembers = members.map((m) => ({
      name: String(m.name || '').trim(),
      rollNumber: String(m.rollNumber || '').trim(),
       email: String(m.email || '').trim().toLowerCase(),
    }));
   if (teamMembers.some((m) => !m.name || !m.rollNumber || !m.email)) {
  return res.status(400).json({ message: 'Each member needs name, rollNumber and email' });
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

    // Send confirmation emails and await to prevent hosting from killing background tasks
    const uniqueEmails = new Set();
    const emailPromises = [];

    // Send to Team Lead (the person registering)
    const leadEmail = String(email).trim().toLowerCase();
    uniqueEmails.add(leadEmail);
    const leadSubject = `Registration Successful: ${event.title}`;
    const leadText = `Hi ${req.user.name}, you have successfully registered for ${event.title} as team ${teamName}.`;
    const leadHtml = getRegistrationSuccessEmail(event, req.user.name, teamName);
    emailPromises.push(sendEmail(leadEmail, leadSubject, leadText, leadHtml).catch((err) => console.error("Email error:", err)));

    teamMembers.forEach((member) => {
      if (member.email && !uniqueEmails.has(member.email)) {
        uniqueEmails.add(member.email);
        const subject = `Registration Successful: ${event.title}`;
        const text = `Hi ${member.name}, you have successfully registered for ${event.title} as part of team ${teamName}.`;
        const html = getRegistrationSuccessEmail(event, member.name, teamName);
        emailPromises.push(sendEmail(member.email, subject, text, html).catch((err) => console.error("Email error:", err)));
      }
    });

    await Promise.all(emailPromises);

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
