// Submissions page - displays user's submitted reports and their status
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submissionsAPI } from '../services/api';

export default function Submissions() {
  // State management for submissions and loading
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Function to fetch submissions from API
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await submissionsAPI.getMine();
      setSubmissions(response.data.submissions || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Submissions</h1>
          <Link
            to="/submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md transition text-center text-sm sm:text-base"
          >
            + New Submission
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading submissions...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Submissions list */}
        {!loading && !error && (
          <>
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 mb-4">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1">
                            {submission.title}
                          </h3>
                          <div className="sm:hidden">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                submission.status
                              )}`}
                            >
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-2 mb-3 sm:mb-4">
                          {submission.content}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                          <span>Submitted: {formatDate(submission.submittedAt)}</span>
                          {submission.reviewedAt && (
                            <span>Reviewed: {formatDate(submission.reviewedAt)}</span>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:block ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                            submission.status
                          )}`}
                        >
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Score and feedback display */}
                    {submission.score !== null && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4 mb-2">
                          <span className="text-base sm:text-lg font-semibold text-gray-700">
                            Score: <span className="text-blue-600">{submission.score}/100</span>
                          </span>
                          {submission.score >= 70 && (
                            <span className="text-green-600 font-semibold text-sm sm:text-base">✓ Certification Eligible</span>
                          )}
                          {submission.score < 70 && (
                            <span className="text-orange-600 font-semibold text-sm sm:text-base">Needs Improvement</span>
                          )}
                        </div>
                        {submission.feedback && (
                          <div className="mt-2 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                            <p className="text-gray-600">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* View details link */}
                    <div className="mt-4">
                      <Link
                        to={`/submissions/${submission.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">You haven't submitted any reports yet.</p>
                <Link
                  to="/submit"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
                >
                  Submit Your First Report
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

