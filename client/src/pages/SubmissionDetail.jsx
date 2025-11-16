// Submission detail page - shows full details of a single submission
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionsAPI } from '../services/api';

export default function SubmissionDetail() {
  const { id } = useParams();
  // State management for submission data and loading
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch submission details on component mount
  useEffect(() => {
    fetchSubmission();
  }, [id]);

  // Function to fetch submission from API
  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await submissionsAPI.getById(id);
      setSubmission(response.data.submission);
      setError(null);
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError(err.response?.data?.error || 'Failed to load submission.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Submission not found'}
          </div>
          <Link to="/submissions" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/submissions"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Submissions
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header with title and status */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{submission.title}</h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                submission.status
              )}`}
            >
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1).replace('_', ' ')}
            </span>
          </div>

          {/* Submission metadata */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Submitted:</span> {formatDate(submission.submittedAt)}
              </div>
              {submission.reviewedAt && (
                <div>
                  <span className="font-semibold">Reviewed:</span> {formatDate(submission.reviewedAt)}
                </div>
              )}
              {submission.reviewerName && (
                <div>
                  <span className="font-semibold">Reviewed by:</span> {submission.reviewerName}
                </div>
              )}
            </div>
          </div>

          {/* Score display */}
          {submission.score !== null && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-blue-600">
                  Score: {submission.score}/100
                </span>
                {submission.score >= 70 ? (
                  <span className="text-green-600 font-semibold text-lg">
                    ✓ Certification Eligible
                  </span>
                ) : (
                  <span className="text-orange-600 font-semibold text-lg">
                    Needs Improvement (Minimum 70 required)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Report Content</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {submission.content}
              </p>
            </div>
          </div>

          {/* Feedback section */}
          {submission.feedback && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Reviewer Feedback</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {submission.feedback}
                </p>
              </div>
            </div>
          )}

          {/* Pending status message */}
          {submission.status === 'pending' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Your submission is currently under review. You will receive feedback and a score once it has been reviewed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

