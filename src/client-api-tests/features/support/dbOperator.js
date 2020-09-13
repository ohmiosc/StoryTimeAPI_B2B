const {database} = require("./aws_utils");


class DBOperator {

    constructor(){
        this.database = database();
    }

    async getItemFromTableByID(tableName, itemID){
        const key =  { id: { S: itemID } };
        try {
            const item = await this.database.getItem({TableName: tableName, Key: key}).promise();
            return item["Item"]
        } catch (e) {
            console.log(`Could not get item with id = ${itemID}`, e.toString());
            return null
        }
    }
}

module.exports = DBOperator;

