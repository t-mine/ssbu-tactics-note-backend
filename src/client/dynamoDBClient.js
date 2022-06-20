'use strict';

const AWS = require('aws-sdk');

/**
 * 使い方
 * const DynamoDb = require('../clients/dynamoDBClient');
 * const dynamoDb = DynamoDb.create();
 */
module.exports.create = function () {
  return new AWS.DynamoDB.DocumentClient({
    maxRetries: 5,
    httpOptions: { timeout: 2000 },
  });
};
