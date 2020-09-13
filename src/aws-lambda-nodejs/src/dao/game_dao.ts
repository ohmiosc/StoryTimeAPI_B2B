import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';
import { Game } from '../models/game_model';

@Injectable()
export class GameDAO extends DynamoDBDAO<Game> {

  async getItemFromDB(table: string, itemId: string): Promise<Game> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: Game): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<Game> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<Game[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
