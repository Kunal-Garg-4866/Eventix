import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getUserNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getUserNotifications);
router.patch('/:id/read', markAsRead);

export default router;
