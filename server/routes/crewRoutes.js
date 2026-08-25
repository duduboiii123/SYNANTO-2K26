import express from 'express';
import { getCrews } from '../controllers/crewController.js';

const router = express.Router();

router.route('/').get(getCrews);

export default router;
