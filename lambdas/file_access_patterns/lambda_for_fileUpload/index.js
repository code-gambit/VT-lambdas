const AWS = require("aws-sdk");
//AWS.config.loadFromPath("../../../keys.json");
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}
function generateTimestamp() {
  const ts = Date.now();
  const pattern = DT.compile("YYYY-MM-DD-HH-mm-ss");
  const timestamp = DT.format(new Date(ts), pattern);
  return timestamp;
}

exports.uploadFile = async (event) => {
  const reqBody = event.body;
  const timestamp = generateTimestamp()
  const file = {
    PK: `USER#${event.path.u_id}`,
    SK: `FILE#${timestamp}`,
    LS1_SK: reqBody.f_name,
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
        PK: `USER#${event.path.u_id}`,
        SK: `METADATA`,  //token is password hash
      },
      UpdateExpression: "add storage_used :file_size",
      ExpressionAttributeValues: {
        ":file_size": reqBody.f_size,
      },
    }).promise()
    return response(201,"File upload success")
  }
  catch(err){
    return response(err.statusCode,err.message)
  }
}
