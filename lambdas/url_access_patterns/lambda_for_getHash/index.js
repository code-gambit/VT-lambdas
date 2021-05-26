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
        if(url_data.Items[0]==undefined) return response(404,"Provided URL is invalid",undefined);
        url_data=url_data.Items[0];
        if(url_data.visible===false)return response(403,"Provided URL is not accessible",undefined)
        if(url_data.clicks_left<=0)return response(403,"Provided URL is not accessible",undefined)
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);;
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
        return  response(200,undefined,url_data.hash);
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);;
    }
}
