import { DynamoDBDAO } from './dynamodb_dao';
import { Injectable } from '@nestjs/common';
import { IAppUserTypeHistoryModel } from '../model/app_user_type_history_model';

@Injectable()
export class AppUserTypeHistoryDAO extends DynamoDBDAO<IAppUserTypeHistoryModel> {

  async getItemFromDB(table: string, itemId: string): Promise<IAppUserTypeHistoryModel> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: IAppUserTypeHistoryModel): Promise<void> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<IAppUserTypeHistoryModel> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<IAppUserTypeHistoryModel[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
