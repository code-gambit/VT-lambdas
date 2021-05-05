const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
    return {
      statusCode: statusCode,
      body: message,
    };
}

exports.handler = async (event) =>{        
    try{
        var params={
            TableName: 'V-Transfer',
            Key:{
                PK: `FILE#${event.path.fileId}`,
                SK: `URL#${event.path.urlId}`
            }
        }
        await dynamo.delete(params).promise();        
        return response(201,"URL delete success");
    }
    catch(err){
        return response(err.statusCode, err.message);
    }
}