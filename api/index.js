const snapsave = require("../snapsave-downloader/src/index");

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET' && req.url === '/') {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Instagram Video Downloader</title>
      </head>
      <body>
        <h1>Instagram Video Downloader API</h1>
        <p>Use /api/igdl?url=YOUR_INSTAGRAM_URL to download videos</p>
      </body>
      </html>
    `);
  }

  if (req.method === 'GET' && req.url.startsWith('/api/igdl')) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const instagramUrl = url.searchParams.get('url');

      if (!instagramUrl) {
        return res.status(400).json({ error: "URL parameter is missing" });
      }

      const downloadedURL = await snapsave(instagramUrl);
      return res.status(200).json({ url: downloadedURL });
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  }

  return res.status(404).json({ error: "Not Found" });
};