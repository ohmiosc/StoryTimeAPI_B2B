import { DynamoDBDAO } from './dynamodb_dao';
import { Injectable } from '@nestjs/common';
import { SubscriptionHistoryNew } from '../model/subscription_package_model_new';

Injectable()
export class SubscriptionHistoryDAONew extends DynamoDBDAO<SubscriptionHistoryNew> {

  async getItemFromDB(table: string, itemId: string): Promise<SubscriptionHistoryNew> {
    return super.getItemFromDB(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<SubscriptionHistoryNew> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
