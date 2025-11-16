// Admin routes - handles admin-only operations
import express from 'express';
import db from '../database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all submissions (admin only)
router.get('/submissions', requireAdmin, (req, res) => {
  try {
    // Fetch all submissions
    const allSubmissions = db.submissions.findAll();
    
    // Add user and reviewer information to each submission
    const submissions = allSubmissions.map(submission => {
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

      return submissionWithUser;
    });

    // Sort by submitted date (newest first)
    submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({ submissions });
  } catch (error) {
    console.error('Get all submissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/users', requireAdmin, (req, res) => {
  try {
    // Fetch all users (passwords are already excluded in findAll)
    const users = db.users.findAll();

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get statistics (admin only)
router.get('/stats', requireAdmin, (req, res) => {
  try {
    // Get total users count
    const allUsers = db.users.findAll();
    const totalUsers = allUsers.length;
    
    // Get total submissions count
    const allSubmissions = db.submissions.findAll();
    const totalSubmissions = allSubmissions.length;
    
    // Get pending submissions count
    const pendingSubmissions = db.submissions.countByStatus('pending');
    
    // Get approved submissions count (assuming score >= 70 is passing)
    const approvedSubmissions = db.submissions.countByScore(70);

    res.json({
      stats: {
        totalUsers,
        totalSubmissions,
        pendingSubmissions,
        approvedSubmissions
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
