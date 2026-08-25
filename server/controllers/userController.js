import User from '../models/User.js';
import Crew from '../models/Crew.js';
import mongoose from 'mongoose';
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

    let crew = null;
    if (crewId && mongoose.isValidObjectId(crewId)) {
      crew = await Crew.findById(crewId);
    }
    if (!crew && typeof crewId === 'string') {
      crew = await Crew.findOne({ slug: crewId });
    }
    if (!crew) {
      // Pick first available crew or create one
      crew = await Crew.findOne();
    }
    if (!crew) {
      crew = await Crew.create({
        name: "Apex Redline's Crew",
        slug: "apex-redline",
        carName: "Apex V8 Prototype",
        colorPrimary: "#ef4444",
        colorSecondary: "#f59e0b"
      });
    }

    const user = await User.create({
      name,
      crew: crew._id
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
