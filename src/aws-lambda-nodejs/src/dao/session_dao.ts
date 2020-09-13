import { DynamoDBDAO } from './dynamo_db_dao';
import { ISession } from '../models/session_model';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

export class SessionDAO extends DynamoDBDAO<ISession> {

  async putItemToDB(table: string, item: ISession): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }
}
