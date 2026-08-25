import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  order: { type: Number, required: true, unique: true },
  partName: { type: String, required: true },
  storyMessage: { type: String, required: true },
  eventMessage: { type: String, required: true },
  daysToGoOverride: { type: Number },
  isActive: { type: Boolean, default: true }
});

const Milestone = mongoose.model('Milestone', milestoneSchema);
export default Milestone;
