import { Router } from 'express';
import {
  registerForEvent,
  myRegistrations,
  listEventRegistrations,
} from '../controllers/registrationController.js';
import { authenticate, requireRole, attachUser } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, requireRole('student'), myRegistrations);
router.post('/events/:eventId', authenticate, requireRole('student'), attachUser, registerForEvent);
router.get(
  '/events/:eventId',
  authenticate,
  requireRole('society_admin'),
  listEventRegistrations
);

export default router;
