import mongoose from 'mongoose';

const crewSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  carName: { type: String, default: '' },
  tagline: { type: String, default: '' },
  image: { type: String, default: '' },
  colorPrimary: { type: String, required: true },
  colorSecondary: { type: String, required: true },
  totalPoints: { type: Number, default: 0 },
  memberCount: { type: Number, default: 0 }
}, { timestamps: true });

const Crew = mongoose.model('Crew', crewSchema);
export default Crew;
