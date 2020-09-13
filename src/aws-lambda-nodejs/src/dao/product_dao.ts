import { DynamoDBDAO } from './dynamo_db_dao';
import { IProductModel } from '../models/product_model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductDAO extends DynamoDBDAO<IProductModel> {

  async getItemFromDB(table: string, itemId: string): Promise<IProductModel> {
    return super.getItemFromDB(table, itemId);
  }
}
