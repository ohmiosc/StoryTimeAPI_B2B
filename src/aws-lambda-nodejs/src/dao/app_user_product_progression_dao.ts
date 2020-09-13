import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { AppUserProductProgression } from '../models/app_user_product_progression_model';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

@Injectable()
export class AppUserProductProgressionDAO extends DynamoDBDAO<AppUserProductProgression> {

  async getItemFromDB(table: string, itemId: string): Promise<AppUserProductProgression> {
    return super.getItemFromDB(table, itemId);
  }

  async getItemFromDBByKey(table: string, key: object): Promise<AppUserProductProgression> {
    return super.getItemFromDBByKey(table, key);
  }

  async putItemToDB(table: string, item: AppUserProductProgression): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<AppUserProductProgression> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<AppUserProductProgression[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
