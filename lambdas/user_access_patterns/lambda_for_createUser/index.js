const AWS = require("aws-sdk");
const crypto = require("crypto");
//AWS.config.loadFromPath("../../../keys.json");
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

function hmac_hash(secretKey, password) {
  const hashingSecret = secretKey;
  const plainText = password;
  const hashedStr = crypto
    .createHmac("sha256", hashingSecret)
    .update(plainText)
    .digest("hex");

  return hashedStr;
}

module.exports.createUser = async (event) => {
  const reqBody = event.body;
  const user = {
    name: reqBody.name,
    PK: `USER#${reqBody.user_email}`,
    SK: `METADATA`,
    thumbnail: reqBody.thumbnail,
    password:`${hmac_hash(reqBody.user_email, reqBody.user_password)}`,
    verified: true,
    provider: reqBody.provider,
    storage_used: 0,
    type: "default",
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
