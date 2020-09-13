import { DynamoDBDAO } from './dynamo_db_dao';
import { Injectable } from '@nestjs/common';
import { ContentVersion } from '../models/content_version';

@Injectable()
export class ContentVersionDAO extends DynamoDBDAO<ContentVersion> {

  async getAllItems(table: string): Promise<ContentVersion[]> {
    return super.getAllItems(table);
  }
}
