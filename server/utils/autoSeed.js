import bcrypt from 'bcryptjs';
import Crew from '../models/Crew.js';
import Milestone from '../models/Milestone.js';
import EventConfig from '../models/EventConfig.js';
import Admin from '../models/Admin.js';

export const autoSeed = async () => {
  try {
    // 1. Check and seed Crews
    const crewCount = await Crew.countDocuments();
    if (crewCount === 0) {
      console.log('🏎️ Seeding Cars Crews...');
      const crews = [
        {
          name: "McQueen's Racers",
          slug: "mcqueens-racers",
          carName: "Lightning McQueen #95",
          tagline: "Ka-Chow! Speed, Precision & Legend",
          image: "/assets/crews/mcqueen.png",
          colorPrimary: "#E62020",
          colorSecondary: "#FBBF24",
          totalPoints: 0,
          memberCount: 0
        },
        {
          name: "Storm's Racers",
          slug: "storms-racers",
          carName: "Jackson Storm #20",
          tagline: "Next-Gen Aerodynamics & High-Tech Speed",
          image: "/assets/crews/storm.png",
          colorPrimary: "#0051FF",
          colorSecondary: "#1E293B",
          totalPoints: 0,
          memberCount: 0
        },
        {
          name: "Cruz's Speedsters",
          slug: "cruzs-speedsters",
          carName: "Cruz Ramirez #51",
          tagline: "Dinoco Racing Power & Pure Determination",
          image: "/assets/crews/cruz.png",
          colorPrimary: "#F59E0B",
          colorSecondary: "#0284C7",
          totalPoints: 0,
          memberCount: 0
        },
        {
          name: "Doc's Racing Legends",
          slug: "docs-racing-legends",
          carName: "Fabulous Hudson Hornet #51",
          tagline: "Fabulous Hudson Hornet Champion Heritage",
          image: "/assets/crews/doc.png",
          colorPrimary: "#1E3A8A",
          colorSecondary: "#D97706",
          totalPoints: 0,
          memberCount: 0
        }
      ];
      await Crew.insertMany(crews);
      console.log('✅ Crews seeded successfully.');
    } else {
      // Ensure image paths and taglines are updated if missing
      const existingCrews = await Crew.find();
      const updates = [
        { slug: "mcqueens-racers", image: "/assets/crews/mcqueen.png", carName: "Lightning McQueen #95", tagline: "Ka-Chow! Speed, Precision & Legend", colorPrimary: "#E62020", colorSecondary: "#FBBF24" },
        { slug: "storms-racers", image: "/assets/crews/storm.png", carName: "Jackson Storm #20", tagline: "Next-Gen Aerodynamics & High-Tech Speed", colorPrimary: "#0051FF", colorSecondary: "#1E293B" },
        { slug: "cruzs-speedsters", image: "/assets/crews/cruz.png", carName: "Cruz Ramirez #51", tagline: "Dinoco Racing Power & Pure Determination", colorPrimary: "#F59E0B", colorSecondary: "#0284C7" },
        { slug: "docs-racing-legends", image: "/assets/crews/doc.png", carName: "Fabulous Hudson Hornet #51", tagline: "Fabulous Hudson Hornet Champion Heritage", colorPrimary: "#1E3A8A", colorSecondary: "#D97706" }
      ];
      for (const u of updates) {
        await Crew.findOneAndUpdate({ slug: u.slug }, { $set: u });
      }
    }

    // 2. Check and seed Milestones
    const milestoneCount = await Milestone.countDocuments();
    if (milestoneCount === 0) {
      console.log('🔧 Seeding Assembly Milestones...');
      const milestones = [
        { order: 1, partName: "Chassis & Racing Wheels", storyMessage: "Mounting the high-grip speedway tires onto the reinforced alloy chassis.", eventMessage: "The starting grid is assembling. Cars Build is approaching!" },
        { order: 2, partName: "V8 Twin-Turbo Engine", storyMessage: "Ignition system primed. 850 horsepower roaring to life with full nitro compression.", eventMessage: "Something big and electrifying is roaring on the horizon." },
        { order: 3, partName: "Aerodynamic Bodywork", storyMessage: "Sculpting the carbon-fiber aero lines for optimal speed and downforce.", eventMessage: "The championship ride is taking its legendary form." },
        { order: 4, partName: "High-Beam Neon Optics", storyMessage: "Calibrating the high-output night-race optic projectors.", eventMessage: "The track ahead is fully illuminated. The wait is almost over." },
        { order: 5, partName: "Piston Cup Livery & Spoilers", storyMessage: "Applying team emblems, downforce spoilers, and gold racing numbers.", eventMessage: "All systems calibrated. Time to hit the gas!" }
      ];
      await Milestone.insertMany(milestones);
      console.log('✅ Milestones seeded successfully.');
    }

    // 3. Check and seed EventConfig
    const configCount = await EventConfig.countDocuments();
    if (configCount === 0) {
      console.log('🏆 Seeding Event Configuration...');
      await EventConfig.create({
        eventName: 'CARS BUILD: PISTON CUP SPEEDWAY',
        eventDate: new Date('2026-09-15T09:00:00Z'),
        venue: 'WCE Sangli - Main Auditorium',
        revealUnlockCopy: 'DESTINATION UNLOCKED: PISTON CUP SPEEDWAY'
      });
      console.log('✅ EventConfig seeded successfully.');
    }

    // 4. Check and seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('🔐 Seeding Default Admin Credentials...');
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        passwordHash,
        role: 'superadmin'
      });
      console.log('✅ Admin seeded successfully (Username: admin | Password: admin123).');
    }
  } catch (error) {
    console.error('⚠️ AutoSeed warning:', error.message);
  }
};
