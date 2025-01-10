const router = require('express').Router();
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { auth } = require('../middleware/auth');
const codeExecutionService = require('../services/codeExecutionService');

// Submit solution
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const problem = await Problem.findById(problemId);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    let testCasesPassed = 0;
    let status = 'Accepted';
    let executionTime = 0;

    // Run all test cases
    for (const testCase of problem.testCases) {
      try {
        const startTime = Date.now();
        const result = await codeExecutionService.executeCode(
          language,
          code,
          testCase.input
        );
        const endTime = Date.now();
        executionTime = Math.max(executionTime, endTime - startTime);

        if (result.output.trim() === testCase.expectedOutput.trim()) {
          testCasesPassed++;
        } else {
          status = 'Wrong Answer';
          break;
        }
      } catch (error) {
        if (error.message === 'Time Limit Exceeded') {
          status = 'Time Limit Exceeded';
        } else {
          status = 'Runtime Error';
        }
        break;
      }
    }

    // Create submission record
    const submission = new Submission({
      problem: problemId,
      user: req.user.id,
      language,
      code,
      status,
      testCasesPassed,
      totalTestCases: problem.testCases.length,
      executionTime
    });

    await submission.save();

    res.json({
      status,
      testCasesPassed,
      totalTestCases: problem.testCases.length,
      executionTime
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's submissions
router.get('/my', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('problem', 'title')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submission by id
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problem')
      .populate('user', 'username');
      
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Only allow users to view their own submissions or admins to view all
    if (submission.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/test-submission', async (req, res) => {
  try {
    const testSubmission = new Submission({
      problem: req.body.problemId,
      user: req.body.userId,
      language: 'javascript',
      code: 'function twoSum(nums, target) { return [0,1]; }',
      status: 'Accepted',
      testCasesPassed: 2,
      totalTestCases: 2,
      executionTime: 100
    });
    
    await testSubmission.save();
    res.json({ message: 'Test submission created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 