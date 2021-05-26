const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error=undefined, message=undefined) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}

exports.handler = async (event) =>{
    try{
        var params={
            TableName:"V-Transfer",
            IndexName:"FIND_FILE_BY_URLID",
            KeyConditionExpression: "GS1_PK= :pk",
            ExpressionAttributeValues:{
                ':pk':`${event.path.urlId}`,
            },
        }
        var url_data = await dynamo.query(params).promise()
        if(url_data.Items[0]==undefined) return response(404,error="Provided URL is invalid");
        url_data=url_data.Items[0];
        if(url_data.visible===false)return response(403,error="Provided URL is not accessible")
        if(url_data.clicks_left<=0)return response(403,error="Provided URL is not accessible")
    }
    catch(err){
        return response(500,error="Internal Server Error");;
    }
    try{
        await dynamo.update({
            TableName: "V-Transfer",
            Key: {
                PK: `${url_data.PK}`,
                SK: `${url_data.SK}`
            },
            UpdateExpression: "add clicks_left :val",
            ExpressionAttributeValues: {
                ":val": -1
            }
        }).promise();
        return  response(200,message=url_data.hash);
    }
    catch(err){
        return response(500,error="Internal Server Error");;
    }
}
