'use strict';

const https = require('https');
const { resolve } = require('path');

const apiKey = process.env.YOUTUBE_API_KEY

const keywords = [
  'マエスマ',
  'ssbu'
];

function getRequest(keyword) {

  const params = {
    key: apiKey,
    type: 'video',
    part: 'snippet',
    q: keyword
  }
  // URLSearchParamsはエンコードもしてくれる
  const urlSearchParam =  new URLSearchParams(params).toString();
  const url = `https://www.googleapis.com/youtube/v3/search?${urlSearchParam}`;

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
