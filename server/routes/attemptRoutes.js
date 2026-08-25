import express from 'express';
import { startAttempt, completeAttempt, getAttempt } from '../controllers/attemptController.js';
import { attemptLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/start', attemptLimiter, startAttempt);
router.post('/:id/complete', completeAttempt);
router.get('/:id', getAttempt);

export default router;
