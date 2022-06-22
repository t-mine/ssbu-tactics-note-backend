'use strict';

const https = require('https');
const { resolve } = require('path');

const DynamoDb = require('../client/dynamoDBClient');
const dynamoDb = DynamoDb.create();
const apiKey = process.env.YOUTUBE_API_KEY;
const keywords = ['マエスマ', 'ssbu'];

function getRequest(keyword) {
  const date = new Date();
  // 1日前
  date.setDate(date.getDate() - 1);

  const params = {
    key: apiKey,
    type: 'video',
    part: 'snippet',
    q: keyword,
    maxResults: 1000,
    publishedAfter: date.toISOString(),
  };
  // URLSearchParamsはエンコードもしてくれる
  const urlSearchParam = new URLSearchParams(params).toString();
  const url = `https://www.googleapis.com/youtube/v3/search?${urlSearchParam}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let rawData = '';

      res.on('data', (chunk) => {
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

    req.on('error', (err) => {
      reject(new Error(err));
    });
  });
}

exports.handler = async (event) => {
  try {
    const results = await Promise.all(keywords.map((k) => getRequest(k)));

    const videoIds = results.map((r) => r.items.map((item) => item.id.videoId)).flat();

    console.log(videoIds.join(','));

    const saveVideo = (videoId) => {
      return new Promise((resolve, reject) => {
        const params = {
          TableName: 'video',
          Item: {
            videoId: videoId,
          },
        };
        dynamoDb
          .put(params)
          .promise()
          .then((r) => {
            resolve();
          })
          .catch((e) => {
            console.error('Unable to update item. Error JSON:', JSON.stringify(e, null, 2));
            reject(e);
          });
      });
    };

    await Promise.all(videoIds.map((videoId) => saveVideo(videoId)));

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
