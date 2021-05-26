const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error, message) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
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
        return  response(200,undefined,"URL delete success");
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);
    }
}
