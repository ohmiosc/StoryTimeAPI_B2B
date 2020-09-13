import { AppUserProgressionQuestionsByProduct } from '../models/app_user_product_progression_by_questions_model';
import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

@Injectable()
export class AppUserProgressionQuestionsByProductDAO extends DynamoDBDAO<AppUserProgressionQuestionsByProduct> {

  async getItemFromDB(table: string, itemId: string): Promise<AppUserProgressionQuestionsByProduct> {
    return super.getItemFromDB(table, itemId);
  }

  async getItemFromDBByKey(table: string, key: object): Promise<AppUserProgressionQuestionsByProduct> {
    return super.getItemFromDBByKey(table, key);
  }

  async putItemToDB(table: string, item: AppUserProgressionQuestionsByProduct): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<AppUserProgressionQuestionsByProduct> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<AppUserProgressionQuestionsByProduct[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
