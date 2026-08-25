import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Crew from './models/Crew.js';
import Milestone from './models/Milestone.js';
import EventConfig from './models/EventConfig.js';
import Admin from './models/Admin.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cars-build');
    console.log('MongoDB Connected for Seeding');

    await Crew.deleteMany();
    await Milestone.deleteMany();
    await EventConfig.deleteMany();
    await Admin.deleteMany();

    const crews = [
      {
        name: "McQueen's Racers",
        slug: "mcqueens-racers",
        carName: "Lightning McQueen #95",
        tagline: "Ka-Chow! Speed, Precision & Legend",
        image: "/assets/crews/mcqueen.png",
        colorPrimary: "#E62020",
        colorSecondary: "#FBBF24"
      },
      {
        name: "Storm's Racers",
        slug: "storms-racers",
        carName: "Jackson Storm #20",
        tagline: "Next-Gen Aerodynamics & High-Tech Speed",
        image: "/assets/crews/storm.png",
        colorPrimary: "#0051FF",
        colorSecondary: "#1E293B"
      },
      {
        name: "Cruz's Speedsters",
        slug: "cruzs-speedsters",
        carName: "Cruz Ramirez #51",
        tagline: "Dinoco Racing Power & Pure Determination",
        image: "/assets/crews/cruz.png",
        colorPrimary: "#F59E0B",
        colorSecondary: "#0284C7"
      },
      {
        name: "Doc's Racing Legends",
        slug: "docs-racing-legends",
        carName: "Fabulous Hudson Hornet #51",
        tagline: "Fabulous Hudson Hornet Champion Heritage",
        image: "/assets/crews/doc.png",
        colorPrimary: "#1E3A8A",
        colorSecondary: "#D97706"
      }
    ];
    await Crew.insertMany(crews);
    console.log('Crews seeded');

    const milestones = [
      { order: 1, partName: "Performance Racing Wheels & Slicks", storyMessage: "Aligning and torquing alloy racing wheels and Brembo carbon-ceramic brakes.", eventMessage: "Starting grid is assembling. DSA Launchpad 2026 is approaching!" },
      { order: 2, partName: "Twin-Turbocharged V8 Engine", storyMessage: "Ignition system primed. 850 horsepower twin-turbo V8 roaring to life.", eventMessage: "Get ready to ignite your coding skills at DSA Launchpad!" },
      { order: 3, partName: "Aerodynamic Carbon-Fiber Shell", storyMessage: "Mounting the high-downforce sculpted carbon-fiber chassis panels.", eventMessage: "Level up your problem-solving algorithms with precision." },
      { order: 4, partName: "Laser Matrix Neon Headlights", storyMessage: "Calibrating high-output laser optic projectors for night speedways.", eventMessage: "Illuminating the future of algorithms and data structures." },
      { order: 5, partName: "Piston Cup Livery & Nitro Supercharger", storyMessage: "Mounting the high-downforce GT rear wing and pressurized NOS bottles.", eventMessage: "The paddock is fully tuned. The countdown to DSA Launchpad begins!" }
    ];
    await Milestone.insertMany(milestones);
    console.log('Milestones seeded');

    await EventConfig.create({
      eventName: 'DSA LAUNCHPAD 6.0',
      eventDate: new Date('2026-10-11T10:00:00Z'),
      venue: 'Mini CCF, WCE Sangli',
      revealUnlockCopy: 'DESTINATION UNLOCKED: DSA LAUNCHPAD 6.0'
    });
    console.log('EventConfig seeded');

    const passwordHash = await bcrypt.hash('admin123', 10);
    await Admin.create({
      username: 'admin',
      passwordHash,
      role: 'superadmin'
    });
    console.log('Admin seeded (admin / admin123)');

    console.log('Database Seeding Completed Successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error with Data Seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
