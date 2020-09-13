import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { AppUserProgressionVideosByProduct } from '../models/app_user_product_progression_by_video_model';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

@Injectable()
export class AppUserProgressionVideosByProductDAO extends DynamoDBDAO<AppUserProgressionVideosByProduct> {

  async getItemFromDB(table: string, itemId: string): Promise<AppUserProgressionVideosByProduct> {
    return super.getItemFromDB(table, itemId);
  }

  async getItemFromDBByKey(table: string, key: object): Promise<AppUserProgressionVideosByProduct> {
    return super.getItemFromDBByKey(table, key);
  }

  async putItemToDB(table: string, item: AppUserProgressionVideosByProduct): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<AppUserProgressionVideosByProduct> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<AppUserProgressionVideosByProduct[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
