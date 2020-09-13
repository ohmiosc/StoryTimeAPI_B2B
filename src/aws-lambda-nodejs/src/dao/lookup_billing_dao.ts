import { DynamoDBDAO } from './dynamo_db_dao';
import { ILookupBilling } from '../models/lookup_billing_model';

export class LookupBillingDAO extends DynamoDBDAO<ILookupBilling> {
  async getItemFromDB(table: string, itemId: string): Promise<ILookupBilling> {
    return super.getItemFromDB(table, itemId);
  }
  async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<ILookupBilling> {
    return super.getItemByGSI(table, gsiName, keyConditionExpression, expressionAttributeValues);
  }
}
