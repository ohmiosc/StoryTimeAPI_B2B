import { DynamoDB } from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/dynamodb';

const options: ClientConfiguration = {
  endpoint: process.env.AU_AWS_DYNAMO_ENDPOINT,
  region: process.env.AU_AWS_REGION,
  accessKeyId: process.env.AU_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AU_AWS_SECRET_ACCESS_KEY,
};

export const dbClient = new DynamoDB.DocumentClient(options);
