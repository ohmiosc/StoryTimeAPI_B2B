import { DynamoDBDAO } from './dynamo_db_dao';
import { IProgress } from '../models/progress_model';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

export class AppUserProgressionDAO extends DynamoDBDAO<IProgress> {

  async getItemFromDB(table: string, itemId: string): Promise<IProgress> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: IProgress): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<IProgress> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
