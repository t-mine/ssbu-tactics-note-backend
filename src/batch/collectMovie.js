'use strict';

const https = require('https');

const apiKey = process.env.YOUTUBE_API_KEY

function getRequest() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=video&part=snippet&q=dog`;

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
    const result = await getRequest();
    console.log('result is:', result);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log('Error is:', error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
