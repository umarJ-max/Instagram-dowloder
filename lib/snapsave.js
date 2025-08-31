const axios = require('axios');
const cheerio = require('cheerio');

module.exports = snapsave = async (url) => {
  return new Promise(async (resolve) => {
    try {
      if (!url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) && !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) {
        return resolve({
          'developer': '@SamiHann',
          'status': false,
          'msg': 'Invalid URL'
        });
      }

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Referer': 'https://snapsave.app/',
        'Origin': 'https://snapsave.app'
      };

      const response = await axios.post('https://snapsave.app/action.php?lang=en', `url=${encodeURIComponent(url)}`, { headers });
      const html = response.data;
      
      const $ = cheerio.load(html);
      const downloadLinks = [];

      $('a[href*=".mp4"], a[href*="download"]').each((index, element) => {
        const $element = $(element);
        const downloadUrl = $element.attr('href');
        const quality = $element.text().trim() || $element.parent().text().trim() || 'HD';
        
        if (downloadUrl && downloadUrl.startsWith('http')) {
          downloadLinks.push({
            quality: quality,
            url: downloadUrl
          });
        }
      });

      if (downloadLinks.length === 0) {
        return resolve({
          'developer': '@SamiHann',
          'status': false,
          'msg': 'No download links found'
        });
      }

      return resolve({
        'developer': '@SamiHann',
        'status': true,
        'data': downloadLinks
      });

    } catch (error) {
      return resolve({
        'developer': '@SamiHann',
        'status': false,
        'msg': error.message
      });
    }
  });
};