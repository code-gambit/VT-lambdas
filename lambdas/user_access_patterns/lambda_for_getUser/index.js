/**
* This lambda takes the userId and return the user record corresponding to 
* the given userId.
* @listens API Gateway: GET /user/:userId
* @see {@link https://app.swaggerhub.com/apis-docs/code-gambit/V-Transfer/1.0.0}
*/
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
