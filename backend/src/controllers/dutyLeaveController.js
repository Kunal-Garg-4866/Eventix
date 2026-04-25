import { DutyLeave } from '../models/DutyLeave.js';
import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';
import { Society } from '../models/Society.js';
import { Notification } from '../models/Notification.js';

export async function applyDutyLeave(req, res, next) {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply' });
    }
    const { event: eventId, reason } = req.body;
    if (!eventId || !reason) {
      return res.status(400).json({ message: 'event and reason are required' });
    }
    const reg = await Registration.findOne({ event: eventId, student: req.userId });
    if (!reg) {
      return res.status(400).json({ message: 'You must be registered for this event to apply' });
    }
    const existing = await DutyLeave.findOne({ student: req.userId, event: eventId });
    if (existing) {
      return res.status(400).json({ message: 'Duty leave already submitted for this event' });
    }
    const dl = await DutyLeave.create({
      student: req.userId,
      event: eventId,
      reason,
      status: 'pending',
    });
    const populated = await DutyLeave.findById(dl._id).populate('event', 'title date society');
    res.status(201).json({ dutyLeave: populated });
  } catch (e) {
    next(e);
  }
}

export async function myDutyLeaves(req, res, next) {
  try {
    const items = await DutyLeave.find({ student: req.userId })
      .populate({ path: 'event', populate: { path: 'society', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json({ dutyLeaves: items });
  } catch (e) {
    next(e);
  }
}

export async function listSocietyDutyLeaves(req, res, next) {
  try {
    const society = await Society.findOne({ admin: req.userId });
    if (!society) {
      return res.json({ dutyLeaves: [] });
    }
    const events = await Event.find({ society: society._id }).select('_id');
    const ids = events.map((e) => e._id);
    const items = await DutyLeave.find({ event: { $in: ids } })
      .populate('student', 'name email rollNumber')
      .populate('event', 'title date')
      .sort({ createdAt: -1 });
    res.json({ dutyLeaves: items });
  } catch (e) {
    next(e);
  }
}

export async function updateDutyLeaveStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'status must be approved or rejected' });
    }
    const dl = await DutyLeave.findById(req.params.id).populate('event');
    if (!dl) {
      return res.status(404).json({ message: 'Duty leave not found' });
    }
    const society = await Society.findById(dl.event.society);
    if (!society || society.admin.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    dl.status = status;
    await dl.save();
    const populated = await DutyLeave.findById(dl._id)
      .populate('student', 'name email rollNumber')
      .populate('event', 'title date');
      
    await Notification.create({
      user: dl.student,
      message: `Your duty leave for ${populated.event.title} has been ${status}`,
      type: 'duty_leave',
    });

    res.json({ dutyLeave: populated });
  } catch (e) {
    next(e);
  }
}
