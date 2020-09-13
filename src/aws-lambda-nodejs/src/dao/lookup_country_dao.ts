import { DynamoDBDAO } from './dynamo_db_dao';
import { LookupCountry } from '../models/lookup_country_model';

export class LookupCountryDAO extends DynamoDBDAO<LookupCountry> {
  async getItemFromDB(table: string, itemId: string): Promise<LookupCountry> {
    return super.getItemFromDB(table, itemId);
  }
  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<LookupCountry> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
