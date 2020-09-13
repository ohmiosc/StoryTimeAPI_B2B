import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { ClientVersion } from '../models/client_version_model';

@Injectable()
export class ClientVersionDAO extends DynamoDBDAO<ClientVersion> {

  async getItemFromDB(table: string, itemId: string): Promise<ClientVersion> {
    return super.getItemFromDB(table, itemId);
  }
}
