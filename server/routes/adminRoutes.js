import express from 'express';
import { login, getAnalytics, getAttempts, exportAttemptsCsv, resetDatabase, deleteAttempt } from '../controllers/adminController.js';
import { getAllMilestones, updateMilestone } from '../controllers/milestoneController.js';
import { getEventConfig, updateEventConfig } from '../controllers/eventController.js';
import { getCrews, createCrew, updateCrew, deleteCrew } from '../controllers/crewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);

router.use(protect);

router.get('/milestones', getAllMilestones);
router.put('/milestones/:id', updateMilestone);

router.get('/event-config', getEventConfig);
router.put('/event-config', updateEventConfig);

router.get('/crews', getCrews);
router.post('/crews', createCrew);
router.put('/crews/:id', updateCrew);
router.delete('/crews/:id', deleteCrew);

router.get('/analytics', getAnalytics);
router.get('/attempts', getAttempts);
router.delete('/attempts/:id', deleteAttempt);
router.get('/attempts/csv', exportAttemptsCsv);
router.post('/reset-db', resetDatabase);

export default router;
