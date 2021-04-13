const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json")

//Use the below code for local setup
/*AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000",
});*/

const dynamo = new AWS.DynamoDB.DocumentClient();
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

module.exports.createUser = async (event) => {
  const reqBody = event.body;
  const user = {
    PK: `USER#${reqBody.u_email}`,
    SK: `METADATA`,
    name: reqBody.u_name,
    type: reqBody.u_type,
    storage_used: 0,
    thumbnail: reqBody.u_thumbnail,
  };

  try{
    await dynamo.put({
      TableName:"V-Transfer",
      Item: user
    }).promise()
    return response(201,`User ${reqBody.name} created successfully`)
  }
  catch(err){
    return response(err.statusCode,err.message)
  }
}
