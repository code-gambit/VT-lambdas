const AWS = require("aws-sdk");
const crypto = require("crypto");
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

module.exports.createUser = (event, ctx, callback) => {
  const reqBody = JSON.parse(event.body);
  const user = {
    u_name: reqBody.u_name,
    PK: reqBody.u_email,
    SK: `#METADATA#${reqBody.u_email}`,
    u_age: reqBody.u_age,
    u_thumbnail: reqBody.u_thumbnail,
    u_is_verified: true,
    u_provider: reqBody.u_provider,
    u_password: hmac_hash(reqBody.u_email, reqBody.u_password),
    u_space_used: 0,
    u_user_type: "default",
  };

  return dynamo
    .put({
      TableName: "V-Transfer",
      Item: user,
    })
    .promise()
    .then(() => {
      callback(null, response(201, `User ${user.u_name} created successfully`));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};
