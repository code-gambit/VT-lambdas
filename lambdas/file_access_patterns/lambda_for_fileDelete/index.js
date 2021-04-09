const AWS = require("aws-sdk");
const crypto = require("crypto");
const dynamo = new AWS.DynamoDB.DocumentClient();
//AWS.config.loadFromPath("../../../keys.json");
//Use the below code for local setup
/*AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000",
});*/

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

exports.deleteFile = async (event) => {
  const reqBody = event.body;
  var params = {
    TableName: "V-Transfer",
    Key: {
      PK: `USER#${reqBody.user_email}`,
      SK: `#FILE#${reqBody.timestamp}`,
    },
  };
  try{
    await dynamo.delete(params).promise()

    await dynamo.update({
    TableName: "V-Transfer",
    Key: {
      PK: `USER#${reqBody.user_email}`,
      SK: `METADATA`,  //token is password hash
    },
    UpdateExpression: "add storage_used :size",
    ExpressionAttributeValues: {
      ":size": -reqBody.size,
    },
  }).promise()
  return response(201,"File delete success")
}
  catch(err){
    return response(err.statusCode,err.message)
  }
}
