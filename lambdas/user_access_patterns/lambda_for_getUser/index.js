const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error, message) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}

exports.handler = async (event) => {
    const params = {
        TableName: 'V-Transfer',
        Key: {
            PK: `USER#${event.path.userId}`,
            SK: 'METADATA'
        }
    }
    try {
        const result = await dynamo.get(params).promise()
        return response(200, undefined,result.Item)
    } catch (err) {
        return response(500,"Internal Server Error",undefined)
    }
};
