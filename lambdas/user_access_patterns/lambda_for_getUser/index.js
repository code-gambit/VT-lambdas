const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error=undefined, message=undefined) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}



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
        return response(200, message=result.Item)
    } catch (err) {
        return response(500,error="Internal Server Error")
    }
};
