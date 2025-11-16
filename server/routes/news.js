// News routes - handles fetching news articles from API or mock data
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Mock news data - used as fallback when API is unavailable
const mockNewsData = [
  {
    title: "Breaking: Major Policy Changes Announced",
    description: "Government officials have announced significant policy changes affecting multiple sectors.",
    url: "#",
    urlToImage: "https://via.placeholder.com/400x250?text=News+1",
    publishedAt: new Date().toISOString(),
    source: { name: "Byline News" }
  },
  {
    title: "Technology Sector Sees Record Growth",
    description: "The technology sector has experienced unprecedented growth this quarter, analysts report.",
    url: "#",
    urlToImage: "https://via.placeholder.com/400x250?text=News+2",
    publishedAt: new Date().toISOString(),
    source: { name: "Byline News" }
  },
  {
    title: "Climate Summit Reaches Historic Agreement",
    description: "World leaders have reached a historic agreement on climate action at the international summit.",
    url: "#",
    urlToImage: "https://via.placeholder.com/400x250?text=News+3",
    publishedAt: new Date().toISOString(),
    source: { name: "Byline News" }
  },
  {
    title: "Sports: Championship Finals This Weekend",
    description: "The highly anticipated championship finals are set to take place this weekend.",
    url: "#",
    urlToImage: "https://via.placeholder.com/400x250?text=News+4",
    publishedAt: new Date().toISOString(),
    source: { name: "Byline News" }
  },
  {
    title: "Healthcare Innovation Breakthrough",
    description: "Researchers announce a major breakthrough in healthcare technology that could save millions of lives.",
    url: "#",
    urlToImage: "https://via.placeholder.com/400x250?text=News+5",
    publishedAt: new Date().toISOString(),
    source: { name: "Byline News" }
  },
  {
    title: "Economic Forecast Shows Positive Trends",
    description: "Latest economic forecasts indicate positive trends for the upcoming fiscal year.",
    url: "#",
    urlToImage: "https://via.placeholder.com/400x250?text=News+6",
    publishedAt: new Date().toISOString(),
    source: { name: "Byline News" }
  }
];

// Get news articles endpoint
router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // If API key is available, try to fetch from NewsAPI.org
    if (apiKey) {
      try {
        // Fetch top headlines from NewsAPI.org - limit to 3 for performance
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            country: 'us',
            pageSize: 3, // Reduced to top 3 articles
            apiKey: apiKey
          },
          timeout: 5000 // 5 second timeout
        });

        // Return API data if successful - filter and ensure images work
        if (response.data && response.data.articles) {
          const filteredArticles = response.data.articles
            .filter(article => article.title && article.description)
            .slice(0, 3) // Ensure only 3 articles
            .map(article => ({
              ...article,
              // Ensure image URL is valid, use placeholder if not
              urlToImage: article.urlToImage && article.urlToImage.startsWith('http') 
                ? article.urlToImage 
                : `https://via.placeholder.com/800x450?text=${encodeURIComponent(article.title.substring(0, 20))}`
            }));
          
          return res.json({
            articles: filteredArticles,
            source: 'api'
          });
        }
      } catch (apiError) {
        // If API fails, fall back to mock data
        console.log('NewsAPI failed, using mock data:', apiError.message);
      }
    }

    // Return mock data (either API key not set or API failed) - limit to top 3
    res.json({
      articles: mockNewsData.slice(0, 3), // Only return top 3
      source: 'mock'
    });
  } catch (error) {
    console.error('News fetch error:', error);
    // Return mock data on any error - limit to top 3
    res.json({
      articles: mockNewsData.slice(0, 3), // Only return top 3
      source: 'mock'
    });
  }
});

export default router;

