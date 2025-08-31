const axios = require('axios');

module.exports = async (url) => {
  try {
    // Extract post ID from URL
    const postId = url.match(/\/p\/([^\/\?]+)/)?.[1] || url.match(/\/reel\/([^\/\?]+)/)?.[1];
    if (!postId) throw new Error('Invalid Instagram URL');

    // Get post data
    const response = await axios.get(`https://www.instagram.com/p/${postId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Extract video URL from page
    const videoMatch = response.data.match(/"video_url":"([^"]+)"/);
    if (!videoMatch) throw new Error('No video found');

    const videoUrl = videoMatch[1].replace(/\\u0026/g, '&');
    
    return {
      status: true,
      data: [{
        quality: 'HD',
        url: videoUrl
      }]
    };
  } catch (error) {
    return {
      status: false,
      msg: error.message
    };
  }
};