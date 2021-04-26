const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  //console.log(event)
  let userAttr = event.request.userAttributes;
  const user = {
    PK: `USER#${userAttr.sub}`,
    SK: `METADATA`,
    email: userAttr.email,
    type: "default",
    storage_used: 0,
    thumbnail: userAttr['custom:profile_image'],
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
