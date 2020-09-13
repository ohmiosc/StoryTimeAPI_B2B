import { dbClient } from '../config/aws_config';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import GetItemInput = DocumentClient.GetItemInput;
import PutItemInput = DocumentClient.PutItemInput;
import QueryInput = DocumentClient.QueryInput;
import DeleteItemInput = DocumentClient.DeleteItemInput;

export class DynamoDBDAO<I> {

  public async getItemFromDB(table: string, itemId: string): Promise<I> {
    const params: GetItemInput = {TableName: table, Key: { id: itemId }};
    try {
      console.log(`Getting item from ${table} table with id ${itemId}`);
      const response = await dbClient.get(params).promise();
      const item: I = response.Item as I;

      if (!item) {
        console.log(`Item with id ${itemId} was not found inside ${table} table`);
        return null;
      }
      console.log('Item = ', JSON.stringify(item));
      return item;
    } catch (e) {
      console.log(`An error has occurred while getting item with id = ${itemId} from ${table}. ${e.toString()}`);
      return null;
    }
  }

  public async putItemToDB(table: string, item: I): Promise<void> {
    const params: PutItemInput = {TableName: table, Item: item};
    try {
      console.log(`Putting item ${JSON.stringify(item)} to the ${table} table`);
      await dbClient.put(params).promise();
    } catch (e) {
      console.log(`An error has occurred while putting item ${JSON.stringify(item)} to the ${table} table. ${e.toString()}`);
    }
  }

  public async deleteItemFromBD(table: string, itemId: string): Promise<void> {
    const params: DeleteItemInput = {TableName: table, Key: { id: itemId }};
    try {
      console.log(`Deleting item with id = ${itemId} from  ${table} table`);
      await dbClient.delete(params).promise();
      console.log(`Item with ${itemId} was deleted from ${table} table`);
    } catch (e) {
      console.log(`An error has occurred while deleting item with id ${itemId} to the ${table} table. ${e.toString()}`);
    }
  }

  public async getItemByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<I> {
    const params: QueryInput = {
      TableName: table,
      IndexName: gsiName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    try {
      console.log(`Getting item by GSI ${gsiName} from ${table} table with keyConditionExpression = ${keyConditionExpression}`);
      const response = await dbClient.query(params).promise();
      const items: I[] = response.Items as I[];

      if (items.length === 0) {
        console.log(`Item was not found inside ${table} by such key condition expression ${keyConditionExpression}`);
        return null;
      }

      const item: I = items[0];
      console.log('Item = ', JSON.stringify(item));
      return item;

    } catch (e) {
      console.log(`An error has occurred while getting item by such key condition expression ${keyConditionExpression} from ${table}.`);
      console.log(`${e.toString()}`);
      return null;
    }
  }

  public async getItemsByGSI(table: string, gsiName: string, keyConditionExpression: string, expressionAttributeValues: object): Promise<I[]> {
    const params: QueryInput = {
      TableName: table,
      IndexName: gsiName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    try {
      console.log(`Getting items by GSI ${gsiName} from ${table} table with keyConditionExpression = ${keyConditionExpression}`);
      const response = await dbClient.query(params).promise();
      const items: I[] = response.Items as I[];

      if (items.length === 0) {
        console.log(`Items was not found inside ${table} by such key condition expression ${keyConditionExpression}`);
        return null;
      }

      console.log('Item = ', JSON.stringify(items));
      return items;
    } catch (e) {
      console.log(`An error has occurred while getting items by such key condition expression ${keyConditionExpression} from ${table}.`);
      console.log(`${e.toString()}`);
      return null;
    }
  }

}
