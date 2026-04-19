import { Router } from 'express';
import {
  applyDutyLeave,
  myDutyLeaves,
  listSocietyDutyLeaves,
  updateDutyLeaveStatus,
} from '../controllers/dutyLeaveController.js';
import { authenticate, requireRole, attachUser } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole('student'), attachUser, applyDutyLeave);
router.get('/me', authenticate, myDutyLeaves);
router.get('/society', authenticate, requireRole('society_admin'), listSocietyDutyLeaves);
router.patch('/:id/status', authenticate, requireRole('society_admin'), updateDutyLeaveStatus);

export default router;
