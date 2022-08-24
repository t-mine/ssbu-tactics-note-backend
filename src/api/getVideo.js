'use strict';

const DynamoDb = require('../client/dynamoDBClient');
const dynamoDb = DynamoDb.create();

// 動画取得API
module.exports.handler = async (event, context) => {
  // 検索条件を作成
  const params = {
    TableName: 'video',
  };

  // 検索
  let result;
  try {
    result = await dynamoDb.scan(params).promise();
    console.log('検索結果 : ' + JSON.stringify(result));
  } catch (e) {
    console.log('DynamoDB検索失敗');
    console.log(e);
    // レスポンスを返す
    context.succeed({
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  // レスポンスを返す
  context.succeed({
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(result.Items),
  });
};
