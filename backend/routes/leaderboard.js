const router = require('express').Router();
const Submission = require('../models/Submission');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    // Get the latest successful submission for each problem by each user
    const leaderboard = await Submission.aggregate([
      { $match: { status: 'Accepted' } },
      { $sort: { submittedAt: -1 } },
      {
        $group: {
          _id: {
            user: '$user',
            problem: '$problem'
          },
          submission: { $first: '$$ROOT' }
        }
      },
      {
        $group: {
          _id: '$_id.user',
          problemsSolved: { $sum: 1 },
          totalTime: { $sum: '$submission.executionTime' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          problemsSolved: 1,
          totalTime: 1
        }
      },
      { $sort: { problemsSolved: -1, totalTime: 1 } }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 