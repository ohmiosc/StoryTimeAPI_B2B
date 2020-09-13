const AWS = require('aws-sdk');

const AWS_REGION = process.env.REGION;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

const TABLES = process.env.TABLES.split(',');

const options = {
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
};

const dynamoDB = new AWS.DynamoDB(options);

function formatCurrentDate(milliseconds){
    const validFormatMS = typeof 'string' ? parseInt(milliseconds, 10) : milliseconds;
    const date = new Date(validFormatMS);

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    const hours = date.getUTCHours().toString().length > 1 ? date.getUTCHours() : '0' + date.getUTCHours();
    const minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : '0' + date.getMinutes();
    const seconds = date.getSeconds().toString().length > 1 ? date.getSeconds() : '0' + date.getSeconds();

    return month + '_' + day + '_' +  date.getFullYear() + '_' + hours + '_' + minutes + '_' + seconds;
}


const backUp = async (backupName, tableName) => {
    const params = {
        BackupName: backupName,
        TableName: tableName
    };
    try {
        await dynamoDB.createBackup(params).promise();
        console.log(`${tableName} -> backup created`)
    } catch (e) {
        console.error(e)
    }
};

const backUpTables = async () => {
    console.log('TABLES ============> ', TABLES);
    const currentDate = formatCurrentDate(new Date().getTime());
    for (let i = 0; i < TABLES.length; i++) {
        console.log(`Creating backup for ${TABLES[i]}`);
        await backUp(currentDate, TABLES[i].trim())
    }
};

backUpTables();

