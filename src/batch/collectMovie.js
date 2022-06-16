'use strict';

const https = require('https');
const { resolve } = require('path');

const apiKey = process.env.YOUTUBE_API_KEY

const keywords = [
  'ssbu'
];

function getRequest(keyword) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=video&part=snippet&q=${keyword}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      let rawData = '';

      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(err));
    });
  });
}

exports.handler = async (event) => {
  try {
    const results = await Promise.all(keywords.map(k => getRequest(k)));

    console.log(`length:${results.length}`)
    
    results.forEach(result=>{
      const items = result.items;
      const videIds = items.map(item=>item.id.videoId);
      console.log(videIds.join(','));
    })
    
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };

  } catch (error) {
    console.log('Error is:', error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
