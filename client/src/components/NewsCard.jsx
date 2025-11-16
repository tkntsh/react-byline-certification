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
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback image if loading fails
            e.target.src = 'https://via.placeholder.com/400x250?text=News';
          }}
        />
      )}
      
      {/* News content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.description || 'No description available.'}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{article.source?.name || 'Unknown Source'}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        {article.url && article.url !== '#' && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
          >
            Read More →
          </a>
        )}
      </div>
    </div>
  );
}

