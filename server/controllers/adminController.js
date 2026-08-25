import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Check against .env credentials
    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'pick-something';

    let isAuthenticated = false;
    let authUser = username;

    if (username === envUser && password === envPass) {
      isAuthenticated = true;
      authUser = envUser;
    } else {
      const admin = await Admin.findOne({ username });
      if (admin && (await admin.comparePassword(password))) {
        isAuthenticated = true;
        authUser = admin.username;
      }
    }

    if (isAuthenticated) {
      const token = jwt.sign(
        { adminId: 'admin', username: authUser, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({ token });
    } else {
      res.status(401);
      throw new Error('Invalid admin credentials. Please check your .env settings.');
    }
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const totalParticipants = await User.countDocuments();
    const totalAttempts = await Attempt.countDocuments();
    const completedAttempts = await Attempt.countDocuments({ reachedReveal: true });
    const completionRate = totalAttempts > 0 ? ((completedAttempts / totalAttempts) * 100).toFixed(2) : 0;
    
    const attemptsWithTime = await Attempt.find({ completedAt: { $exists: true } });
    const avgTimeMs = attemptsWithTime.length > 0 
      ? attemptsWithTime.reduce((acc, att) => acc + att.totalTimeMs, 0) / attemptsWithTime.length 
      : 0;

    const crewDistributionData = await User.aggregate([
      { $group: { _id: '$crew', count: { $sum: 1 } } },
      { $lookup: { from: 'crews', localField: '_id', foreignField: '_id', as: 'crewInfo' } },
      { $unwind: '$crewInfo' },
      { $project: { name: '$crewInfo.name', count: 1, _id: 0 } }
    ]);

    const crewDistribution = crewDistributionData.reduce((acc, item) => {
      acc[item.name] = item.count;
      return acc;
    }, {});

    const dropOffFunnel = {
      stage1: await Attempt.countDocuments({ stagesCompleted: { $gte: 1 } }),
      stage2: await Attempt.countDocuments({ stagesCompleted: { $gte: 2 } }),
      stage3: await Attempt.countDocuments({ stagesCompleted: { $gte: 3 } }),
      stage4: await Attempt.countDocuments({ stagesCompleted: { $gte: 4 } }),
      stage5: await Attempt.countDocuments({ stagesCompleted: { $gte: 5 } }),
      reveal: completedAttempts
    };

    res.json({
      totalParticipants,
      totalAttempts,
      completedAttempts,
      completionRate,
      avgTimeMs,
      crewDistribution,
      dropOffFunnel
    });
  } catch (error) {
    next(error);
  }
};

export const getAttempts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { crew, sortBy, order } = req.query;

    const query = {};
    if (crew) query.crew = crew;

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const attempts = await Attempt.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('user', 'name')
      .populate('crew', 'name');

    const totalCount = await Attempt.countDocuments(query);

    res.json({
      attempts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

export const exportAttemptsCsv = async (req, res, next) => {
  try {
    const attempts = await Attempt.find()
      .populate('user', 'name')
      .populate('crew', 'name')
      .sort({ startedAt: -1 });

    const csvHeaders = ['userName', 'crewName', 'score', 'totalTimeMs', 'stagesCompleted', 'bonusClicksHit', 'reachedReveal', 'startedAt', 'completedAt'].join(',');
    
    const csvRows = attempts.map(a => {
      return [
        `"${a.user?.name || ''}"`,
        `"${a.crew?.name || ''}"`,
        a.score,
        a.totalTimeMs || '',
        a.stagesCompleted,
        a.bonusClicksHit,
        a.reachedReveal,
        a.startedAt ? a.startedAt.toISOString() : '',
        a.completedAt ? a.completedAt.toISOString() : ''
      ].join(',');
    });

    const csvString = [csvHeaders, ...csvRows].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('attempts.csv');
    res.send(csvString);
  } catch (error) {
    next(error);
  }
};

export const resetDatabase = async (req, res, next) => {
  try {
    const { mode } = req.body; // 'wipe_attempts' or 'full_reset'
    
    if (mode === 'wipe_attempts') {
      await Attempt.deleteMany({});
      await User.deleteMany({});
      return res.json({ message: 'All driver attempts and participants successfully wiped.' });
    }

    // Full reset
    await Attempt.deleteMany({});
    await User.deleteMany({});
    
    // Import autoSeed to reload fresh data
    const { autoSeed } = await import('../utils/autoSeed.js');
    await autoSeed();

    res.json({ message: 'Database fully reset and re-seeded with official configuration.' });
  } catch (error) {
    next(error);
  }
};

export const deleteAttempt = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Attempt.findByIdAndDelete(id);
    res.json({ message: 'Attempt record deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
