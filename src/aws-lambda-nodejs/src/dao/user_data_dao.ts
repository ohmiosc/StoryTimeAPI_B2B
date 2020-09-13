import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';
import { SpinnerGameProgress } from '../models/spinner_game_progress_model';

@Injectable()
export class SpinnerGameProgressDAO extends DynamoDBDAO<SpinnerGameProgress> {

  async getItemFromDB(table: string, itemId: string): Promise<SpinnerGameProgress> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: SpinnerGameProgress): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<SpinnerGameProgress> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<SpinnerGameProgress[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
