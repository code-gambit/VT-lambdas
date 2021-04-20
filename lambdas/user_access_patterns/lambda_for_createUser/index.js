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
  let reqBody = event.body;
  const user = {    
    PK: `USER#${event.path.u_id}`,
    SK: `METADATA`,
    email: reqBody.u_email,
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