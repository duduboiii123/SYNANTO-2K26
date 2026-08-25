import express from 'express';
import { getMilestones } from '../controllers/milestoneController.js';

const router = express.Router();

router.route('/').get(getMilestones);

export default router;
