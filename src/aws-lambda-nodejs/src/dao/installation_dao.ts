import { DynamoDBDAO } from './dynamo_db_dao';
import { IInstallation } from '../models/installation_model';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { ErrorResponse } from '../responses/error_response';

export class InstallationDAO extends DynamoDBDAO<IInstallation> {

  async putItemToDB(table: string, item: IInstallation): Promise<CommonSuccessResponse | ErrorResponse> {
    return super.putItemToDB(table, item);
  }

  async getItemFromDB(table: string, itemId: string): Promise<IInstallation> {
    return super.getItemFromDB(table, itemId);
  }

  async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    return super.deleteItemFromBD(table, itemId);
  }
}
