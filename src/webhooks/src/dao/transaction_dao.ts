import { Injectable } from '@nestjs/common';
import { TransactionModel } from '../model/transaction_model';
import { DynamoDBDAO } from './dynamodb_dao';

@Injectable()
export class TransactionDAO extends DynamoDBDAO<TransactionModel> {

  async getItemFromDB(table: string, itemId: string): Promise<TransactionModel> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: TransactionModel): Promise<void> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<TransactionModel> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<TransactionModel[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
