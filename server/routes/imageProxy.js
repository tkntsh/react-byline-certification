// Image proxy route - fetches images from external URLs to bypass CORS
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Proxy endpoint for images
router.get('/:encodedUrl', async (req, res) => {
  try {
    // Decode the URL
    const imageUrl = decodeURIComponent(req.params.encodedUrl);
    
    // Validate URL
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }

    // Fetch the image from the external source
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Determine content type from response or URL
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    // Set appropriate headers
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      'Access-Control-Allow-Origin': '*'
    });

    // Send the image data
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Image proxy error:', error.message);
    // Return a 1x1 transparent PNG on error
    const transparentPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache'
    });
    res.send(transparentPng);
  }
});

export default router;

