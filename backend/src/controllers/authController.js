import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function signup(req, res, next) {
  try {
    const { name, email, rollNumber, password, role } = req.body;
    if (!name || !email || !rollNumber || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!['student', 'society_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      rollNumber,
      password: hash,
      role,
    });
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    const safe = user.toJSON();
    res.json({ token, user: safe });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (e) {
    next(e);
  }
}
