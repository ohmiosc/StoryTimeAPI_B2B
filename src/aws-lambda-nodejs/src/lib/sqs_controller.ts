import { sqs } from '../config/sqs_config';
import { CreateQueueRequest, CreateQueueResult, GetQueueUrlRequest, GetQueueUrlResult, SendMessageRequest } from 'aws-sdk/clients/sqs';

export class SQSController {

  private readonly messageRetentionPeriod: string;
  private readonly delay: string;

  constructor() {
    this.messageRetentionPeriod = '86400';
    this.delay = '1';
  }

  public async getQueueUrl(url: string): Promise<string> {
    const param: GetQueueUrlRequest = { QueueName: url };
    console.log(`Getting url ${url}`);
    try {
      const result: GetQueueUrlResult = await sqs.getQueueUrl(param).promise();
      console.log(`Url found ${JSON.stringify(result)}`);
      return result.QueueUrl;
    } catch (e) {
      console.log(`Could not find url ${url}`, e.toString());
      return null;
    }
  }

  public async createQueue(queueName: string): Promise<string> {
    const param: CreateQueueRequest = {
      QueueName: queueName,
      Attributes: {
        DelaySeconds: this.delay,
        MessageRetentionPeriod: this.messageRetentionPeriod,
      },
    };

    console.log(`Creating queue ${queueName}`);
    try {
      const result: CreateQueueResult = await sqs.createQueue(param).promise();
      console.log(`Queue was created ${JSON.stringify(result)}`);
      return result.QueueUrl;
    } catch (e) {
      console.log(`Could not create queue ${queueName}`, e.toString());
      return null;
    }
  }

  public async sendMessage(queueName: string, message: object): Promise<boolean> {
    const params: SendMessageRequest = {
      QueueUrl: queueName,
      MessageBody: JSON.stringify(message),
    };
    try {
      await sqs.sendMessage(params).promise();
      return true;
    } catch (e) {
      console.log(`Could not send message ${JSON.stringify(message)} to ${queueName}`, e.toString());
      return false;
    }
  }
}
