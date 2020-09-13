import { DynamoDBDAO } from './dynamo_db_dao';
import { IVerificationToken } from '../models/verification_token_model';
import { Injectable } from '@nestjs/common';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

@Injectable()
export class VerificationTokenDAO extends DynamoDBDAO<IVerificationToken> {

  async putItemToDB(table: string, item: IVerificationToken): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async getItemFromDB(table: string, itemId: string): Promise<IVerificationToken> {
    return super.getItemFromDB(table, itemId);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }

  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<IVerificationToken> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }

  async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<IVerificationToken[]> {
    return super.getItemsByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
