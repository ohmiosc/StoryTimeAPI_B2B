import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';
import { Collection } from '../models/collection_model';

@Injectable()
export class CollectionDAO extends DynamoDBDAO<Collection> {

  async getItemFromDB(table: string, itemId: string): Promise<Collection> {
    return super.getItemFromDB(table, itemId);
  }

  async putItemToDB(table: string, item: Collection): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<Collection> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<Collection[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
