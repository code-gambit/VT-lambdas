const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) { return { statusCode: statusCode, body: message } }


exports.handler = async (event) => {
    // TODO implement
    const params = {
        TableName: 'V-Transfer',
        Key: {
            PK: `USER#${event.path.userId}`,
            SK: 'METADATA'
        }
    }
    try {
        const result = await dynamo.get(params).promise()
        return response(200, result.Item)
    } catch (err) {
        return response(err.statusCode, err.message)
    }
};
