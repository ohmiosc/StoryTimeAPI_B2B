const  AWS  = require("aws-sdk");
const options = {
    endpoint: process.env.AU_AWS_DYNAMO_ENDPOINT,
    region: process.env.AU_AWS_REGION,
    accessKeyId: process.env.AU_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AU_AWS_SECRET_ACCESS_KEY
};

const database = () => new AWS.DynamoDB(options);
module.exports = {database};
