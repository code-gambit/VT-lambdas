const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error, message) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}
function jsonToBase64(json_data){
    if(json_data === undefined) return json_data;
    let encoded = Buffer.from(JSON.stringify(json_data), 'ascii').toString('base64');
    return encoded;
}
function base64ToJson(bString){
    if (bString === undefined || bString === "undefined" || bString === "null" || bString === "") return undefined
    let decoded = JSON.parse(Buffer.from(bString, 'base64').toString('ascii'));
    return decoded;
}

exports.handler = async (event) =>{
    try{
        const reqBody = event.body;
        const lastEvaluatedKey = base64ToJson(event.query.LastEvaluatedKey);
        var params={
            TableName:"V-Transfer",
            ScanIndexForward: false,
            KeyConditionExpression: "#PK= :pk and begins_with(#SK,:sk)",
            ExpressionAttributeNames:{
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues:{
                ':pk':`FILE#${event.path.fileId}`,
                ':sk':"URL#"
            },
            Limit:10,
        }
        if(lastEvaluatedKey !== undefined) params.ExclusiveStartKey = lastEvaluatedKey;
        const url_data = await dynamo.query(params).promise()
        return_data={}
        return_data.items=url_data.Items
        url_data.LastEvaluatedKey!=undefined?return_data.LastEvaluatedKey = jsonToBase64(url_data.LastEvaluatedKey):"";
        return  response(200,undefined,return_data);
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);
    }

}
