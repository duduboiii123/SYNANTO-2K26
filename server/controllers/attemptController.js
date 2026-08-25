import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import Crew from '../models/Crew.js';
import { computeScore } from '../utils/scoring.js';

export const startAttempt = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.body.user;
    if (!userId) {
      res.status(400);
      throw new Error('User ID is required to start an attempt');
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const attempt = await Attempt.create({
      user: userId,
      crew: user.crew,
      ipAddress: req.ip,
      startedAt: Date.now()
    });

    res.status(201).json({ attemptId: attempt._id });
  } catch (error) {
    next(error);
  }
};

export const completeAttempt = async (req, res, next) => {
  try {
    const { stagesCompleted, bonusClicksHit } = req.body;
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      res.status(404);
      throw new Error('Attempt not found');
    }

    if (attempt.completedAt) {
      // If already completed, return existing
      const populated = await Attempt.findById(attempt._id).populate('user').populate('crew');
      return res.json(populated);
    }

    attempt.completedAt = Date.now();
    attempt.totalTimeMs = Math.max(1000, attempt.completedAt - (attempt.startedAt || (attempt.completedAt - 15000)));
    attempt.stagesCompleted = stagesCompleted !== undefined ? stagesCompleted : 5;
    attempt.bonusClicksHit = bonusClicksHit || 0;
    
    attempt.score = computeScore({
      stagesCompleted: attempt.stagesCompleted,
      bonusClicksHit: attempt.bonusClicksHit,
      totalTimeMs: attempt.totalTimeMs
    });

    if (attempt.stagesCompleted >= 5) {
      attempt.reachedReveal = true;
    }

    await attempt.save();

    // Update crew score
    if (attempt.crew) {
      const crew = await Crew.findById(attempt.crew);
      if (crew) {
        crew.totalPoints += attempt.score;
        await crew.save();
      }
    }

    const populatedAttempt = await Attempt.findById(attempt._id).populate('user').populate('crew');
    res.json(populatedAttempt);
  } catch (error) {
    next(error);
  }
};

export const getAttempt = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id).populate('user').populate('crew');
    if (!attempt) {
      res.status(404);
      throw new Error('Attempt not found');
    }
    res.json(attempt);
  } catch (error) {
    next(error);
  }
};
