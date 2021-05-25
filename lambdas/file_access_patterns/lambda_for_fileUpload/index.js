const AWS = require("aws-sdk");
const DT = require("date-and-time");
//AWS.config.loadFromPath("../../../keys.json");
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error=undefined, message=undefined) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
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
    LS1_SK: reqBody.LS1_SK,
    size: reqBody.size,
    hash: reqBody.hash,
    f_type: reqBody.f_type,
  };

  try{
    await dynamo.put({
      TableName:"V-Transfer",
      Item: file
    }).promise()
  }
  catch(err){
    return response(500,error="Internal Server Error");;
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
    return  response(201, message=file)
  }
  catch(err){
    return response(500,error="Internal Server Error");;
  }
}
