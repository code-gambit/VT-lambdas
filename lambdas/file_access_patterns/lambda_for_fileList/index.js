const AWS = require("aws-sdk");
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
    if (bString === undefined) return bString
    let decoded = JSON.parse(Buffer.from(bString, 'base64').toString('ascii'));
    return decoded;
}

exports.handler = async (event) =>{
    try{
        const lastEvaluatedKey = base64ToJson(event.query.LastEvaluatedKey);
        const searchParam = event.query.searchParam;
        var params={
            TableName:"V-Transfer",
            ScanIndexForward: false,
            KeyConditionExpression: "#PK= :pk and begins_with(#SK,:sk)",
            ScanIndexForward: false,
            ExpressionAttributeNames:{
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues:{
                ':pk':`USER#${event.path.userId}`,
                ':sk':"FILE#"
            },
            Limit:10,
        }
        if(searchParam&&searchParam!=="undefined"){
            params.IndexName="FIND_FILE_BY_NAME";
            params.ExpressionAttributeNames={
              "#PK": "PK",
              "#SK": "LS1_SK",
            }
            params.ExpressionAttributeValues={
              ":pk": `USER#${event.path.userId}`,
              ":sk": searchParam,
            }
        }
        if(lastEvaluatedKey !== undefined) params.ExclusiveStartKey = lastEvaluatedKey;
        const file_data = await dynamo.query(params).promise()
        var return_data={}
        return_data.items=file_data.Items
        file_data.LastEvaluatedKey!=undefined?return_data.LastEvaluatedKey = jsonToBase64(file_data.LastEvaluatedKey):"";
        return  response(200,undefined,return_data);
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);;
    }

}
