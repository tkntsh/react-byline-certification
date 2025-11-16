// Submit page - allows users to submit reports for review
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submissionsAPI } from '../services/api';

export default function Submit() {
  // State management for form inputs and submission status
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate input
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    if (content.trim().length < 100) {
      setError('Content must be at least 100 characters long');
      return;
    }

    setLoading(true);

    try {
      // Create submission via API
      await submissionsAPI.create(title, content);
      setSuccess('Report submitted successfully! Redirecting to your submissions...');
      
      // Clear form
      setTitle('');
      setContent('');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/submissions');
      }, 2000);
    } catch (err) {
      // Display error message
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Submit Your Report</h1>
          
          {/* Success message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a descriptive title for your report"
                required
              />
            </div>

            {/* Content textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Report Content * (Minimum 100 characters)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your report here. Be thorough and professional..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                {content.length} characters
              </p>
            </div>

            {/* Submit button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
              <button
                type="button"
                onClick={() => navigate('/submissions')}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

