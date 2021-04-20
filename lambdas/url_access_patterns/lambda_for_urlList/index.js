const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}
  
exports.listUrls = async (event) =>{
    try{
        const url_data = await dynamo.query({
            TableName:"V-Transfer",
            KeyConditionExpression: "#PK= :pk and begins_with(#SK,:sk)",
            ExpressionAttributeNames:{
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues:{
                ':pk':`FILE#${event.path.f_timestamp}`,
                ':sk':"URL#"
            }
        }).promise()        
        return response(200,url_data);
    }
    catch(err){
        return response(err.statusCode,err.message);
    }

}