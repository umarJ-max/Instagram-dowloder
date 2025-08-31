const snapsave = require("../lib/snapsave");
const instagramDirect = require("../lib/instagram-direct");

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

    let result = await snapsave(url);
    
    // If snapsave fails, try direct method
    if (!result.status) {
      result = await instagramDirect(url);
    }
    
    if (!result.status) {
      return res.status(400).json({ 
        error: result.msg || "Failed to download"
      });
    }
    
    return res.status(200).json({
      success: true,
      developer: result.developer,
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