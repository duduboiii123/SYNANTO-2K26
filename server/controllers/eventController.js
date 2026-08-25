import EventConfig from '../models/EventConfig.js';
import Attempt from '../models/Attempt.js';

export const getEventConfig = async (req, res, next) => {
  try {
    const config = await EventConfig.getConfig();
    
    // Always provide difficulty and physics settings to clients
    res.json({
      _id: config._id,
      eventName: config.eventName,
      eventDate: config.eventDate,
      venue: config.venue,
      revealUnlockCopy: config.revealUnlockCopy,
      isRevealLocked: config.isRevealLocked,
      difficulty: config.difficulty || 'NORMAL',
      decaySpeedMultiplier: config.decaySpeedMultiplier || 1.0,
      basePointsPerPart: config.basePointsPerPart || 100,
      speedBonusMultiplier: config.speedBonusMultiplier || 1.0
    });
  } catch (error) {
    next(error);
  }
};

export const getRevealData = async (req, res, next) => {
  try {
    const { attemptId } = req.query;
    if (!attemptId) {
      res.status(403);
      throw new Error('Access denied');
    }

    const attempt = await Attempt.findById(attemptId);
    if (!attempt || !attempt.reachedReveal) {
      res.status(403);
      throw new Error('Access denied');
    }

    const config = await EventConfig.getConfig();
    res.json({
      eventName: config.eventName,
      eventDate: config.eventDate,
      venue: config.venue,
      revealUnlockCopy: config.revealUnlockCopy
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventConfig = async (req, res, next) => {
  try {
    const config = await EventConfig.getConfig();
    const { 
      eventName, 
      eventDate, 
      venue, 
      revealUnlockCopy, 
      isRevealLocked,
      difficulty,
      decaySpeedMultiplier,
      basePointsPerPart,
      speedBonusMultiplier
    } = req.body;

    if (eventName) config.eventName = eventName;
    if (eventDate) config.eventDate = eventDate;
    if (venue) config.venue = venue;
    if (revealUnlockCopy) config.revealUnlockCopy = revealUnlockCopy;
    if (isRevealLocked !== undefined) config.isRevealLocked = isRevealLocked;

    if (difficulty) config.difficulty = difficulty;
    if (decaySpeedMultiplier !== undefined) config.decaySpeedMultiplier = decaySpeedMultiplier;
    if (basePointsPerPart !== undefined) config.basePointsPerPart = basePointsPerPart;
    if (speedBonusMultiplier !== undefined) config.speedBonusMultiplier = speedBonusMultiplier;

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (error) {
    next(error);
  }
};
