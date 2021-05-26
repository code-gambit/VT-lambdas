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
exports.handler = async (event) =>{
    try{
        var params={
            TableName: "V-Transfer",
            KeyConditionExpression: "#PK= :pk and #SK= :sk",
            ExpressionAttributeNames:{
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues:{
                ':pk':`USER#${event.path.userId}`,
                ':sk':`FILE#${event.path.fileId}`
            },
        }
        var file_data = await dynamo.query(params).promise()
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);;
    }

    try{
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
        const url_data = await dynamo.query(params).promise()
        return_data = {}
        return_data.file_data = file_data.Items[0];
        return_data.url_data = {}
        return_data.url_data.items = url_data.Items;
        url_data.LastEvaluatedKey!=undefined?return_data.url_data.LastEvaluatedKey = jsonToBase64(url_data.LastEvaluatedKey):"";
        return  response(200,undefined,return_data);
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);;
    }
}
