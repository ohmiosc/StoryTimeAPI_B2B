import { DynamoDBDAO } from './dynamodb_dao';
import { IAppUser } from '../model/app_user_model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppUserDAO extends DynamoDBDAO<IAppUser> {

  async getItemFromDB(table: string, itemId: string): Promise<IAppUser> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: IAppUser): Promise<void> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<IAppUser> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

}
