const snapsave = require("../lib/snapsave");
const instagramDirect = require("../lib/instagram-direct");
const axios = require('axios');

// Alternative method using embed endpoint
const getVideoEmbed = async (url) => {
  try {
    const postId = url.match(/\/(?:p|reel|tv)\/([^\/\?]+)/)?.[1];
    if (!postId) throw new Error('Invalid URL');

    const embedUrl = `https://www.instagram.com/p/${postId}/embed/`;
    const response = await axios.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const videoMatch = response.data.match(/(https?:\/\/[^"\s]+\.mp4[^"\s]*)/g);
    if (videoMatch && videoMatch.length > 0) {
      return {
        status: true,
        data: [{ quality: 'HD', url: videoMatch[0] }]
      };
    }
    throw new Error('No video found in embed');
  } catch (error) {
    return { status: false, msg: error.message };
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL parameter is missing" });
    }

    // Try multiple methods in sequence
    let result = await snapsave(url);
    
    if (!result.status) {
      result = await instagramDirect(url);
    }
    
    if (!result.status) {
      result = await getVideoEmbed(url);
    }
    
    if (!result.status) {
      return res.status(400).json({ 
        error: "No video found. This might be a photo post or the video is not accessible."
      });
    }
    
    return res.status(200).json({
      success: true,
      developer: result.developer || '@SamiHann',
      data: result.data
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: err.message 
    });
  }
};