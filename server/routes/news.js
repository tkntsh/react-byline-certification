// News routes - handles fetching news articles from API or mock data
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Mock news data - used as fallback when API is unavailable
// Uses real publisher names matching the URLs - only images are placeholders
const mockNewsData = [
  {
    title: "Breaking: Major Policy Changes Announced",
    description: "Government officials have announced significant policy changes affecting multiple sectors.",
    url: "https://www.bbc.com/news",
    urlToImage: null, // Use CSS placeholder instead of external service
    publishedAt: new Date().toISOString(),
    source: { name: "BBC News" }
  },
  {
    title: "Technology Sector Sees Record Growth",
    description: "The technology sector has experienced unprecedented growth this quarter, analysts report.",
    url: "https://www.techcrunch.com",
    urlToImage: null, // Use CSS placeholder instead of external service
    publishedAt: new Date().toISOString(),
    source: { name: "TechCrunch" }
  },
  {
    title: "Climate Summit Reaches Historic Agreement",
    description: "World leaders have reached a historic agreement on climate action at the international summit.",
    url: "https://www.reuters.com",
    urlToImage: null, // Use CSS placeholder instead of external service
    publishedAt: new Date().toISOString(),
    source: { name: "Reuters" }
  },
  {
    title: "Sports: Championship Finals This Weekend",
    description: "The highly anticipated championship finals are set to take place this weekend.",
    url: "https://www.espn.com",
    urlToImage: null, // Use CSS placeholder instead of external service
    publishedAt: new Date().toISOString(),
    source: { name: "ESPN" }
  },
  {
    title: "Healthcare Innovation Breakthrough",
    description: "Researchers announce a major breakthrough in healthcare technology that could save millions of lives.",
    url: "https://www.nature.com",
    urlToImage: null, // Use CSS placeholder instead of external service
    publishedAt: new Date().toISOString(),
    source: { name: "Nature" }
  },
  {
    title: "Economic Forecast Shows Positive Trends",
    description: "Latest economic forecasts indicate positive trends for the upcoming fiscal year.",
    url: "https://www.bloomberg.com",
    urlToImage: null, // Use CSS placeholder instead of external service
    publishedAt: new Date().toISOString(),
    source: { name: "Bloomberg" }
  }
];

// Get news articles endpoint
router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // If API key is available, try to fetch from NewsAPI.org
    if (apiKey) {
      try {
        // Fetch top headlines from NewsAPI.org - limit to 6 articles
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            country: 'us',
            pageSize: 6, // Top 6 articles
            apiKey: apiKey
          },
          timeout: 5000 // 5 second timeout
        });

        // Return API data if successful - filter and ensure images work
        if (response.data && response.data.articles) {
          const filteredArticles = response.data.articles
            .filter(article => article.title && article.description)
            .slice(0, 6) // Ensure only 6 articles
            .map(article => ({
              ...article,
              // Ensure image URL is valid, set to null if not (will use CSS placeholder)
              urlToImage: article.urlToImage && article.urlToImage.startsWith('http') && !article.urlToImage.includes('placeholder')
                ? article.urlToImage 
                : null // Use CSS placeholder instead of external service
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

    // Return mock data (either API key not set or API failed) - limit to top 6
    res.json({
      articles: mockNewsData.slice(0, 6), // Only return top 6
      source: 'mock'
    });
  } catch (error) {
    console.error('News fetch error:', error);
    // Return mock data on any error - limit to top 6
    res.json({
      articles: mockNewsData.slice(0, 6), // Only return top 6
      source: 'mock'
    });
  }
});

export default router;

