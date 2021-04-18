const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

module.exports.createUser = async (event) => {
  let reqBody = JSON.parse(event.body);
  const user = {    
    PK: `USER#${reqBody.u_email}`,
    SK: `METADATA`,
    type: "default",
    storage_used: 0,
    thumbnail: reqBody.u_thumbnail,    
  };

  try{
    await dynamo.put({
      TableName:"V-Transfer",
      Item: user
    }).promise()
    return response(201,`User created successfully`)
  }
  catch(err){
    return response(err.statusCode,err.message)
  }
}