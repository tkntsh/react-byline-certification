// Admin dashboard - allows admins to review and mark submissions
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  // State management for submissions, stats, and review modal
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: 'approved',
    score: 70,
    feedback: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Function to fetch submissions and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      const [submissionsRes, statsRes] = await Promise.all([
        adminAPI.getAllSubmissions(),
        adminAPI.getStats()
      ]);
      setSubmissions(submissionsRes.data.submissions || []);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening review modal
  const handleReview = (submission) => {
    setSelectedSubmission(submission);
    setReviewForm({
      status: submission.status || 'approved',
      score: submission.score || 70,
      feedback: submission.feedback || ''
    });
  };

  // Handle submitting review
  const handleSubmitReview = async () => {
    if (!selectedSubmission) return;

    try {
      setSubmitting(true);
      await adminAPI.updateSubmission(
        selectedSubmission.id,
        reviewForm.status,
        reviewForm.score,
        reviewForm.feedback
      );
      
      // Refresh data
      await fetchData();
      setSelectedSubmission(null);
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      needs_revision: 'bg-orange-100 text-orange-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be an administrator to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Admin Dashboard</h1>

        {/* Statistics cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Total Users</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Total Submissions</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.totalSubmissions}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Pending Reviews</h3>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pendingSubmissions}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Approved</h3>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.approvedSubmissions}</p>
            </div>
          </div>
        )}

        {/* Submissions table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Submissions</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      User
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Score
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Submitted
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          <span className="sm:hidden">{submission.title.substring(0, 30)}{submission.title.length > 30 ? '...' : ''}</span>
                          <span className="hidden sm:inline">{submission.title.substring(0, 50)}{submission.title.length > 50 ? '...' : ''}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 sm:hidden">
                          {submission.userName} • {submission.score !== null ? `${submission.score}/100` : 'No score'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-900">{submission.userName}</div>
                        <div className="text-xs text-gray-500">{submission.userEmail}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        {submission.score !== null ? `${submission.score}/100` : '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleReview(submission)}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Submission</h2>
                
                {/* Submission details */}
                <div className="mb-6 p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">{selectedSubmission.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">By: {selectedSubmission.userName}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.content}</p>
                </div>

                {/* Review form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="approved">Approved</option>
                      <option value="needs_revision">Needs Revision</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score (0-100) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={reviewForm.score}
                      onChange={(e) => setReviewForm({ ...reviewForm, score: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Minimum score of 70 required for certification
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback *
                    </label>
                    <textarea
                      rows={6}
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Provide detailed feedback for the user..."
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

