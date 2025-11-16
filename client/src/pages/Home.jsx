// Home page - displays news articles in a grid layout
import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import NewsCard from '../components/NewsCard';

export default function Home() {
  // State management for news articles and loading
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news articles on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Function to fetch news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getNews();
      setNews(response.data.articles || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Welcome to Byline Certification
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8">
            Your platform for journalism training and certification
          </p>
          <p className="text-sm sm:text-base md:text-lg opacity-90">
            Submit your reports, get expert feedback, and earn your byline certification
          </p>
        </div>
      </div>

      {/* News section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Latest News</h2>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* News grid - displaying top 6 articles */}
        {!loading && !error && (
          <>
            {news.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {news.slice(0, 6).map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-600 text-sm sm:text-base">No news articles available at the moment.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

