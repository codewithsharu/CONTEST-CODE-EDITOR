const router = require('express').Router();
const Problem = require('../models/Problem');
const { auth, isAdmin } = require('../middleware/auth');

// Get all problems (public fields only)
router.get('/', auth, async (req, res) => {
  try {
    const problems = await Problem.find({}, {
      title: 1,
      difficulty: 1,
      description: 1,
      sampleInput: 1,
      sampleOutput: 1
    });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single problem
router.get('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    // Remove hidden test cases for non-admin users
    if (req.user.role !== 'admin') {
      problem.testCases = problem.testCases.filter(tc => !tc.isHidden);
    }
    
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new problem (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body,
      createdBy: req.user.id
    });
    const savedProblem = await problem.save();
    res.status(201).json(savedProblem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update problem (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete problem (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 