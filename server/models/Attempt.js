import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crew: { type: mongoose.Schema.Types.ObjectId, ref: 'Crew', required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  totalTimeMs: { type: Number },
  stagesCompleted: { type: Number, default: 0 },
  bonusClicksHit: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  reachedReveal: { type: Boolean, default: false },
  ipAddress: { type: String }
});

attemptSchema.index({ score: -1 });

const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;
