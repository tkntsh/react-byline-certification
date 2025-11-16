// Submissions routes - handles report submissions and admin review
import express from 'express';
import db from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create new submission (authenticated users only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Create submission in database
    const submission = db.submissions.create({
      userId,
      title,
      content,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Submission created successfully',
      submission
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's own submissions (authenticated users only)
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all submissions for the current user
    const userSubmissions = db.submissions.findByUserId(userId);
    
    // Add user name to each submission
    const submissions = userSubmissions.map(submission => {
      const user = db.users.findById(submission.userId);
      return {
        ...submission,
        userName: user ? user.name : 'Unknown'
      };
    });

    // Sort by submitted date (newest first)
    submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single submission by ID (authenticated users can see their own, admins can see all)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const submissionId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    // Fetch submission from database
    const submission = db.submissions.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user has permission to view this submission
    if (!isAdmin && submission.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add user information to submission
    const user = db.users.findById(submission.userId);
    const submissionWithUser = {
      ...submission,
      userName: user ? user.name : 'Unknown',
      userEmail: user ? user.email : 'Unknown'
    };

    // Add reviewer name if reviewed
    if (submission.reviewedBy) {
      const reviewer = db.users.findById(submission.reviewedBy);
      if (reviewer) {
        submissionWithUser.reviewerName = reviewer.name;
      }
    }

    res.json({ submission: submissionWithUser });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update submission (admin only - for marking/reviewing)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const submissionId = req.params.id;
    const { status, score, feedback } = req.body;
    const reviewerId = req.user.id;

    // Validate input
    if (!status || score === undefined) {
      return res.status(400).json({ error: 'Status and score are required' });
    }

    // Check if submission exists
    const existing = db.submissions.findById(submissionId);
    if (!existing) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Update submission with review details
    const updatedSubmission = db.submissions.update(submissionId, {
      status,
      score: parseInt(score),
      feedback: feedback || '',
      reviewedBy: reviewerId
    });

    // Add user information to response
    const user = db.users.findById(updatedSubmission.userId);
    const submissionWithUser = {
      ...updatedSubmission,
      userName: user ? user.name : 'Unknown',
      userEmail: user ? user.email : 'Unknown'
    };

    // Add reviewer name
    const reviewer = db.users.findById(reviewerId);
    if (reviewer) {
      submissionWithUser.reviewerName = reviewer.name;
    }

    res.json({
      message: 'Submission updated successfully',
      submission: submissionWithUser
    });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
