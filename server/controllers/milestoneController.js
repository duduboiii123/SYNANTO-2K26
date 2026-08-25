import Milestone from '../models/Milestone.js';
import EventConfig from '../models/EventConfig.js';

export const getMilestones = async (req, res, next) => {
  try {
    const milestones = await Milestone.find({ isActive: true }).sort({ order: 1 });
    const config = await EventConfig.getConfig();
    
    const now = new Date();
    const eventDate = new Date(config.eventDate);
    const totalDaysRemaining = Math.max(0, Math.ceil((eventDate - now) / 86400000));

    const computedMilestones = milestones.map(m => {
      let daysToGo;
      if (m.daysToGoOverride !== undefined && m.daysToGoOverride !== null) {
        daysToGo = m.daysToGoOverride;
      } else {
        daysToGo = Math.ceil(totalDaysRemaining * (1 - (m.order - 1) * 0.2));
      }
      return { ...m.toObject(), daysToGo };
    });

    res.json(computedMilestones);
  } catch (error) {
    next(error);
  }
};

export const getAllMilestones = async (req, res, next) => {
  try {
    const milestones = await Milestone.find().sort({ order: 1 });
    res.json(milestones);
  } catch (error) {
    next(error);
  }
};

export const updateMilestone = async (req, res, next) => {
  try {
    const { storyMessage, eventMessage, partName, daysToGoOverride, isActive } = req.body;
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      res.status(404);
      throw new Error('Milestone not found');
    }

    milestone.storyMessage = storyMessage || milestone.storyMessage;
    milestone.eventMessage = eventMessage || milestone.eventMessage;
    milestone.partName = partName || milestone.partName;
    if (daysToGoOverride !== undefined) milestone.daysToGoOverride = daysToGoOverride;
    if (isActive !== undefined) milestone.isActive = isActive;

    const updatedMilestone = await milestone.save();
    res.json(updatedMilestone);
  } catch (error) {
    next(error);
  }
};
