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

exports.uploadFile = async (event) => {
  // TODO implement
  const reqBody = event.body;
  var d = new Date();
  const timestamp = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "-" +
    d.getHours() + "-" + d.getMinutes()+ "-" +d.getSeconds();

  const file = {
    PK: `USER#${reqBody.user_email}`,
    SK: `#FILE#${timestamp}`,
    LSI_SK:reqBody.name,
    size: reqBody.size,
    hash: reqBody.hash,
    type:reqBody.type
  };

  try{
    await dynamo.put({
      TableName:"V-Transfer",
      Item: file
    }).promise()

    await dynamo.update({
    TableName: "V-Transfer",
    Key: {
      PK: `USER#${reqBody.user_email}`,
      SK: `METADATA`,  //token is password hash
    },
    UpdateExpression: "add storage_used :file_size",
    ExpressionAttributeValues: {
      ":file_size": reqBody.size,
    },
  }).promise()
  return response(201,"File upload success")
}
  catch(err){
    return response(err.statusCode,err.message)
  }
}
