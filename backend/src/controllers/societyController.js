import { Society } from '../models/Society.js';

export async function listSocieties(req, res, next) {
  try {
    const items = await Society.find().populate('admin', 'name email rollNumber role').sort({ createdAt: -1 });
    res.json({ societies: items });
  } catch (e) {
    next(e);
  }
}

export async function getMySociety(req, res, next) {
  try {
    const society = await Society.findOne({ admin: req.userId });
    if (!society) {
      return res.status(404).json({ message: 'No society assigned' });
    }
    res.json({ society });
  } catch (e) {
    next(e);
  }
}

export async function createSociety(req, res, next) {
  try {
    if (req.user.role !== 'society_admin') {
      return res.status(403).json({ message: 'Only society admins can create a society' });
    }
    const existing = await Society.findOne({ admin: req.userId });
    if (existing) {
      return res.status(400).json({ message: 'You already manage a society' });
    }
    const { name, description, logo } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Society name is required' });
    }
    const society = await Society.create({
      name,
      description: description || '',
      logo: logo || '',
      admin: req.userId,
    });
    res.status(201).json({ society });
  } catch (e) {
    next(e);
  }
}

export async function updateMySociety(req, res, next) {
  try {
    const society = await Society.findOne({ admin: req.userId });
    if (!society) {
      return res.status(404).json({ message: 'No society to update' });
    }
    const { name, description, logo } = req.body;
    if (name !== undefined) society.name = name;
    if (description !== undefined) society.description = description;
    if (logo !== undefined) society.logo = logo;
    await society.save();
    res.json({ society });
  } catch (e) {
    next(e);
  }
}
