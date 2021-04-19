const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

exports.uploadFile = async (event) => {
  const reqBody = event.body;
  var d = new Date();
  const timestamp = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + "-" +
    d.getHours() + "-" + d.getMinutes()+ "-" +d.getSeconds();

  const file = {
    PK: `USER#${event.path.u_id}`,
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
