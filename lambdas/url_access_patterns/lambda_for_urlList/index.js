const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}
function jsonToBase64(json_data){
    if(json_data === undefined) return json_data;
    let encoded = Buffer.from(JSON.stringify(json_data), 'ascii').toString('base64');    
    return encoded;
}
function base64ToJson(bString){
    if (bString === undefined) return bString
    let decoded = JSON.parse(Buffer.from(bString, 'base64').toString('ascii'));
    return decoded;
}
  
exports.listUrls = async (event) =>{
    try{
        const reqBody = event.body;
        const lastEvaluatedKey = base64ToJson(reqBody.LastEvaluatedKey)
        var params={
            TableName:"V-Transfer",
            ScanIndexForward: false,
            KeyConditionExpression: "#PK= :pk and begins_with(#SK,:sk)",
            ExpressionAttributeNames:{
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues:{
                ':pk':`FILE#${event.path.f_timestamp}`,
                ':sk':"URL#"
            },                        
            Limit:10,
        }
        if(lastEvaluatedKey !== undefined) params.ExclusiveStartKey = lastEvaluatedKey;
        const url_data = await dynamo.query(params).promise()        
        url_data.LastEvaluatedKey = jsonToBase64(url_data.LastEvaluatedKey);
        return response(200,url_data);
    }
    catch(err){
        return response(err.statusCode,err.message);
    }

}
