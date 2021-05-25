const AWS = require("aws-sdk");
const DT = require("date-and-time");
//AWS.config.loadFromPath("../../../keys.json");
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: message,
  };
}

function generateTimestamp() {
  const ts = Date.now();
  const pattern = DT.compile("YYYY-MM-DD-HH-mm-ss");
  const timestamp = DT.format(new Date(ts), pattern);
  return timestamp;
}

exports.handler = async (event) => {
  const reqBody = event.body;
  var d = new Date();
  const timestamp = generateTimestamp();
  const file = {
    PK: `USER#${event.path.userId}`,
    SK: `FILE#${timestamp}`,
    LSI_SK: reqBody.f_name,
    size: reqBody.f_size,
    hash: reqBody.f_hash,
    type:reqBody.f_type
  };

  try{
    await dynamo.put({
      TableName:"V-Transfer",
      Item: file
    }).promise()
  }
  catch(err){
    return response(err.statusCode,err.message)
  }

  try{
    await dynamo.update({
      TableName: "V-Transfer",
      Key: {
        PK: `USER#${event.path.userId}`,
        SK: `METADATA`,
      },
      UpdateExpression: "add storage_used :file_size",
      ExpressionAttributeValues: {
        ":file_size": reqBody.f_size,
      },
    }).promise()
    return response(201, file)
  }
  catch(err){
    return response(err.statusCode,err.message)
  }
}
