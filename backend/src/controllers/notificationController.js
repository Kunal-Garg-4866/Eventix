import { Notification } from '../models/Notification.js';

export async function getUserNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ notifications });
  } catch (e) {
    next(e);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ notification });
  } catch (e) {
    next(e);
  }
}
