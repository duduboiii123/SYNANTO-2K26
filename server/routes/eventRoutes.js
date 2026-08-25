import express from 'express';
import { getEventConfig, getRevealData } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getEventConfig);
router.get('/reveal', getRevealData);

export default router;
