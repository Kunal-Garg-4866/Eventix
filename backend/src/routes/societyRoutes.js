import { Router } from 'express';
import {
  listSocieties,
  getMySociety,
  createSociety,
  updateMySociety,
} from '../controllers/societyController.js';
import { authenticate, requireRole, attachUser } from '../middleware/auth.js';

const router = Router();

router.get('/', listSocieties);
router.get('/mine', authenticate, requireRole('society_admin'), attachUser, getMySociety);
router.post('/', authenticate, requireRole('society_admin'), attachUser, createSociety);
router.put('/mine', authenticate, requireRole('society_admin'), attachUser, updateMySociety);

export default router;
