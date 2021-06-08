/**
* This lambda accepts the parameters from AWS Cognito and create a record 
* for the user in *the DynamoDb
* @listens AWS Cognito: Runs after post-confirmation
*/
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let userAttr = event.request.userAttributes;
  const user = {
    PK: `USER#${userAttr.sub}`,
    SK: `METADATA`,
    email: userAttr.email,
    type: "default",
    storage_used: 0,
  };

  try{
    await dynamo.put({
      TableName:"V-Transfer",
      Item: user
    }).promise()
  }
  catch(err){
  }
  return event
}
