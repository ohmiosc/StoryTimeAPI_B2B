import { IOperator } from '../models/operator_model';
import { DynamoDBDAO } from './dynamo_db_dao';

export class OperatorDAO extends DynamoDBDAO<IOperator> {

  async getItemFromDBByKey(table: string, key: object): Promise<IOperator> {
    return super.getItemFromDBByKey(table, key);
  }

}
