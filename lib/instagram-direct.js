const axios = require('axios');

module.exports = async (url) => {
  try {
    const postId = url.match(/\/(?:p|reel|tv)\/([^\/\?]+)/)?.[1];
    if (!postId) throw new Error('Invalid Instagram URL');

    const response = await axios.get(`https://www.instagram.com/p/${postId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    const html = response.data;
    let videoUrl = null;

    // Try multiple patterns
    const patterns = [
      /"video_url":"([^"]+)"/,
      /"src":"([^"]+\.mp4[^"]*)"/,
      /videoUrl":"([^"]+)"/,
      /"url":"([^"]+\.mp4[^"]*)"/
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        videoUrl = match[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
        break;
      }
    }

    if (!videoUrl) {
      // Try to find any .mp4 URL
      const mp4Match = html.match(/(https?:\/\/[^"\s]+\.mp4[^"\s]*)/g);
      if (mp4Match && mp4Match.length > 0) {
        videoUrl = mp4Match[0];
      }
    }

    if (!videoUrl) throw new Error('No video found');
    
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