const { database } = require("./aws_utils");

class dbCleaner {
    constructor(environment = "dev") {
        this.database = database();
        this.environment = environment;
        this.paramsGetItem = function(deviceID) {
            return {
                ExpressionAttributeValues: { ":a": { S: deviceID } },
                FilterExpression: "deviceID = :a",
                ProjectionExpression: "id",
                TableName: `${this.environment}_AppUser`
            };
        };
    }

    getDelItemParams(itemId) {
        if (this.environment === "prod") {
            return;
        }
        return {
            Key: { id: { S: itemId } },
            TableName: `${this.environment}_AppUser`
        };
    }

    async getItemId(deviceID) {
        const response = await this.database.scan(this.paramsGetItem(deviceID)).promise();
        if (response.Count > 0) {
            return response["Items"][0]["id"]["S"];
        }

        throw new Error(`Item ${deviceID} not found!`);
    }

    async deleteItemFromDb(deviceId) {
        const itemId = await this.getItemId(deviceId);
        try {
            await this.database.deleteItem(this.getDelItemParams(itemId)).promise();
            console.log(`Item with ${itemId} was deleted `)
        } catch (error) {
            console.log("While deleting " + itemId + " from AppUser an error occurred ", error)
        }
    }

    async deleteItemFromDbById(id, tableName, indexName) {
        const key =  { [indexName]: { S: id } };
        try {
            await this.database.deleteItem({TableName: tableName, Key: key}).promise();
            console.log("Item with id " + id + " was removed from " + tableName)
        } catch (e) {
            console.log(e);
            console.log("Item with id " + id + " was not removed from " + tableName)
        }
    }
}

module.exports = dbCleaner;
