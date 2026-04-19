import { Event } from '../models/Event.js';
import { Society } from '../models/Society.js';

async function assertAdminOwnsSociety(userId, societyId) {
  const society = await Society.findById(societyId);
  if (!society || society.admin.toString() !== userId.toString()) {
    const err = new Error('You can only manage events for your society');
    err.status = 403;
    throw err;
  }
  return society;
}

export async function listEvents(req, res, next) {
  try {
    const filter = {};
    if (req.query.society) {
      filter.society = req.query.society;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const events = await Event.find(filter)
      .populate('society', 'name description logo')
      .sort({ date: 1 });
    res.json({ events });
  } catch (e) {
    next(e);
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id).populate('society', 'name description logo admin');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ event });
  } catch (e) {
    next(e);
  }
}

export async function listMySocietyEvents(req, res, next) {
  try {
    const society = await Society.findOne({ admin: req.userId });
    if (!society) {
      return res.json({ events: [] });
    }
    const events = await Event.find({ society: society._id })
      .populate('society', 'name description logo')
      .sort({ date: 1 });
    res.json({ events });
  } catch (e) {
    next(e);
  }
}

export async function createEvent(req, res, next) {
  try {
    const society = await Society.findOne({ admin: req.userId });
    if (!society) {
      return res.status(400).json({ message: 'Create your society profile first' });
    }
    const {
      title,
      description,
      eventType,
      teamSizeMin,
      teamSizeMax,
      date,
      status,
      image,
    } = req.body;
    if (!title || !eventType || !date) {
      return res.status(400).json({ message: 'title, eventType, and date are required' });
    }
    let min = eventType === 'team' ? Number(teamSizeMin) || 2 : 1;
    let max = eventType === 'team' ? Number(teamSizeMax) || min : 1;
    if (eventType === 'solo') {
      min = 1;
      max = 1;
    }
    if (min > max) {
      return res.status(400).json({ message: 'teamSizeMin cannot exceed teamSizeMax' });
    }
    const event = await Event.create({
      title,
      description: description || '',
      eventType,
      teamSizeMin: min,
      teamSizeMax: max,
      date: new Date(date),
      status: status || 'upcoming',
      image: image || '',
      society: society._id,
      createdBy: req.userId,
    });
    const populated = await Event.findById(event._id).populate('society', 'name description logo');
    res.status(201).json({ event: populated });
  } catch (e) {
    next(e);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await assertAdminOwnsSociety(req.userId, event.society);
    const {
      title,
      description,
      eventType,
      teamSizeMin,
      teamSizeMax,
      date,
      status,
      image,
    } = req.body;
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (eventType !== undefined) event.eventType = eventType;
    if (teamSizeMin !== undefined) event.teamSizeMin = teamSizeMin;
    if (teamSizeMax !== undefined) event.teamSizeMax = teamSizeMax;
    if (date !== undefined) event.date = new Date(date);
    if (status !== undefined) event.status = status;
    if (image !== undefined) event.image = image;
    if (event.eventType === 'solo') {
      event.teamSizeMin = 1;
      event.teamSizeMax = 1;
    }
    await event.save();
    const populated = await Event.findById(event._id).populate('society', 'name description logo');
    res.json({ event: populated });
  } catch (e) {
    next(e);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await assertAdminOwnsSociety(req.userId, event.society);
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (e) {
    next(e);
  }
}
