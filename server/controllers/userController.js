import User from '../models/User.js';
import Crew from '../models/Crew.js';
import { validationResult } from 'express-validator';

export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { name } = req.body;
    const crewId = req.body.crewId || req.body.crew;

    const crew = await Crew.findById(crewId);
    if (!crew) {
      res.status(404);
      throw new Error('Selected crew not found');
    }

    const user = await User.create({
      name,
      crew: crewId
    });
    crew.memberCount = (crew.memberCount || 0) + 1;
    await crew.save();

    const populatedUser = await User.findById(user._id).populate('crew');
    res.status(201).json(populatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('crew');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};
