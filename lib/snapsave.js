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
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
      };

      const response = await axios.post('https://snapsave.app/action.php?lang=en', 'url=' + url, { headers });
      const html = response.data;
      
      const $ = cheerio.load(html);
      const downloadLinks = [];

      $('.download-items__btn').each((index, element) => {
        const $element = $(element);
        const quality = $element.text().trim() || 'Unknown Quality';
        let downloadUrl = $element.find('a').attr('href') || $element.attr('href');
        
        if (downloadUrl) {
          downloadLinks.push({
            quality: quality,
            url: downloadUrl
          });
        }
      });

      if (downloadLinks.length === 0) {
        $('a[href*="download"]').each((index, element) => {
          const $element = $(element);
          const downloadUrl = $element.attr('href');
          
          if (downloadUrl && downloadUrl.includes('http')) {
            downloadLinks.push({
              quality: 'Default',
              url: downloadUrl
            });
          }
        });
      }

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