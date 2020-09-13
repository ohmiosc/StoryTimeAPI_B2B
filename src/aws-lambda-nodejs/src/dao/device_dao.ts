import { DynamoDBDAO } from './dynamo_db_dao';
import { IDevice } from '../models/device_model';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

export class DeviceDAO extends DynamoDBDAO<IDevice> {

  async putItemToDB(table: string, item: IDevice): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }
}
