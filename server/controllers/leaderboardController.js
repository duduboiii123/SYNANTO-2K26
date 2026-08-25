import Attempt from '../models/Attempt.js';
import Crew from '../models/Crew.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const individuals = await Attempt.find({ score: { $gt: 0 } })
      .sort({ score: -1, totalTimeMs: 1 })
      .limit(250)
      .populate('user', 'name')
      .populate('crew', 'name slug carName tagline image colorPrimary colorSecondary');

    const crews = await Crew.find().sort({ totalPoints: -1 });

    res.json({ 
      individuals, 
      topAttempts: individuals, 
      crews, 
      crewRankings: crews 
    });
  } catch (error) {
    next(error);
  }
};

