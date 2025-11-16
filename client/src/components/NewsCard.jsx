// News card component - displays individual news article
import { useMemo } from 'react';

export default function NewsCard({ article }) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get API base URL for image proxy (same logic as api.js)
  const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
      const url = import.meta.env.VITE_API_URL;
      return url.endsWith('/api') ? url : `${url}/api`;
    }
    return '/api';
  };

  // Make entire card clickable if there's a valid URL
  const handleCardClick = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Generate image proxy URL
  const imageProxyUrl = useMemo(() => {
    if (article.urlToImage && article.urlToImage.startsWith('http') && !article.urlToImage.includes('placeholder')) {
      const apiBase = getApiBaseUrl();
      return `${apiBase}/image-proxy/${encodeURIComponent(article.urlToImage)}`;
    }
    return null;
  }, [article.urlToImage]);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${article.url && article.url !== '#' ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      role={article.url && article.url !== '#' ? 'button' : undefined}
      tabIndex={article.url && article.url !== '#' ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && article.url && article.url !== '#') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* News image */}
      <div className="w-full h-48 sm:h-56 md:h-48 bg-gray-200 relative overflow-hidden">
        {(() => {
          const hasValidImage = article.urlToImage && 
                                article.urlToImage.startsWith('http') && 
                                !article.urlToImage.includes('placeholder');
          
          if (hasValidImage && imageProxyUrl) {
            // Use image proxy to bypass CORS issues
            return (
              <>
                <img
                  src={imageProxyUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // If image fails to load, hide img and show CSS placeholder
                    e.target.style.display = 'none';
                    const placeholder = e.target.parentElement?.querySelector('.image-placeholder');
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                {/* CSS placeholder - hidden by default, shown if image fails */}
                <div 
                  className="image-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 absolute top-0 left-0"
                  style={{ display: 'none' }}
                >
                  <span className="text-white text-center px-4 text-sm sm:text-base font-semibold">
                    {article.title.substring(0, 50)}
                  </span>
                </div>
              </>
            );
          } else {
            // No image URL - show CSS placeholder directly
            return (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                <span className="text-white text-center px-4 text-sm sm:text-base font-semibold">
                  {article.title.substring(0, 50)}
                </span>
              </div>
            );
          }
        })()}
      </div>
      
      {/* News content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
          {article.description || 'No description available.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
          <span className="font-medium">{article.source?.name || 'Unknown Source'}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        {/* Always show Read More link - opens article URL or shows message if unavailable */}
        {article.url && article.url !== '#' ? (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Read Full Story →
          </a>
        ) : (
          <span className="mt-4 inline-block text-gray-400 text-sm sm:text-base italic">
            Full story link unavailable
          </span>
        )}
      </div>
    </div>
  );
}

