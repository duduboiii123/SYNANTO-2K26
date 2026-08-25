import mongoose from 'mongoose';

const eventConfigSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  venue: { type: String, required: true },
  revealUnlockCopy: { type: String, default: 'DESTINATION UNLOCKED: PISTON CUP SPEEDWAY' },
  isRevealLocked: { type: Boolean, default: false },
  
  // Game Difficulty & Physics Tuning (3 Modes: EASY (Demo), MEDIUM, HARD)
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' },
  decaySpeedMultiplier: { type: Number, default: 1.0 },
  basePointsPerPart: { type: Number, default: 100 },
  speedBonusMultiplier: { type: Number, default: 1.0 }
}, { timestamps: true });

eventConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      eventName: 'SYNANTO 2K26 SPEEDWAY',
      eventDate: new Date('2026-10-11T10:00:00Z'),
      venue: 'WCE Sangli',
      revealUnlockCopy: 'DESTINATION UNLOCKED: SYNANTO 2K26 SPEEDWAY',
      difficulty: 'MEDIUM',
      decaySpeedMultiplier: 1.0,
      basePointsPerPart: 100,
      speedBonusMultiplier: 1.0
    });
  }
  return config;
};

const EventConfig = mongoose.model('EventConfig', eventConfigSchema);
export default EventConfig;
