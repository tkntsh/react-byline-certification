// News card component - displays individual news article
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* News image */}
      <div className="w-full h-48 sm:h-56 md:h-48 bg-gray-200 relative overflow-hidden">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback image if loading fails
              e.target.src = `https://via.placeholder.com/800x450?text=${encodeURIComponent(article.title.substring(0, 30))}`;
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
            <span className="text-white text-center px-4 text-sm sm:text-base font-semibold">
              {article.title.substring(0, 50)}
            </span>
          </div>
        )}
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
        {article.url && article.url !== '#' && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base"
          >
            Read More →
          </a>
        )}
      </div>
    </div>
  );
}

