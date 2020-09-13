import { DynamoDBDAO } from './dynamo_db_dao';
import { ISubscriptionHistory } from '../models/subscription_history_model';
import { Injectable } from '@nestjs/common';

Injectable();
export class SubscriptionHistoryDAO extends DynamoDBDAO<ISubscriptionHistory> {
  async getItemFromDB(table: string, itemId: string): Promise<ISubscriptionHistory> {
    return super.getItemFromDB(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<ISubscriptionHistory> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
