import { Router } from 'express';
import {
  listEvents,
  getEvent,
  listMySocietyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { authenticate, requireRole, attachUser } from '../middleware/auth.js';

const router = Router();

router.get('/managed', authenticate, requireRole('society_admin'), listMySocietyEvents);
router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, requireRole('society_admin'), attachUser, createEvent);
router.put('/:id', authenticate, requireRole('society_admin'), attachUser, updateEvent);
router.delete('/:id', authenticate, requireRole('society_admin'), attachUser, deleteEvent);

export default router;
