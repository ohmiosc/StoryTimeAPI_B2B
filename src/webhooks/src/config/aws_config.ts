import { DynamoDB } from 'aws-sdk';

const options = {
  region: process.env.AU_AWS_REGION,
  accessKeyId: process.env.AU_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AU_AWS_SECRET_ACCESS_KEY,
};

export const dbClient = new DynamoDB.DocumentClient(options)
