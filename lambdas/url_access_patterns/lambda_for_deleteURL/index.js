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
            },
            ReturnValues:"ALL_OLD"
        }
        const res=await dynamo.delete(params).promise();
        return  response(200,undefined,res.Attributes);
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);
    }
}
