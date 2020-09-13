import { IAppUser } from '../models/app_user_model';
import { Injectable } from '@nestjs/common';
import { DynamoDBDAO } from './dynamo_db_dao';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

@Injectable()
export class AppUserDAO extends DynamoDBDAO<IAppUser> {

  async getItemFromDB(table: string, itemId: string): Promise<IAppUser> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: IAppUser): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<IAppUser> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

}
