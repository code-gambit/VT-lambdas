const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}
  
exports.listFiles = async (event) =>{
    try{
        const file_data = await dynamo.query({
            TableName:"V-Transfer",
            KeyConditionExpression: "#PK= :pk and begins_with(#SK,:sk)",
            ScanIndexForward: false,
            ExpressionAttributeNames:{
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues:{
                ':pk':`USER#${event.path.u_id}`,
                ':sk':"FILE#"
            }
        }).promise()
        return response(200,file_data);
    }
    catch(err){
        return response(err.statusCode,err.message);
    }

}
