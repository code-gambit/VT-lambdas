const AWS = require("aws-sdk");

//AWS.config.loadFromPath("../../../keys.json");

const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: message,
  };
}

exports.getHash = async (event) =>{
    try{
        var params={
            TableName:"V-Transfer",
            IndexName:"FIND_FILE_BY_URLID",
            KeyConditionExpression: "#PK= :pk",
            ExpressionAttributeNames:{
                "#PK": "GS1_PK",            
            },
            ExpressionAttributeValues:{
                ':pk':`${event.path.url_id}`,                
            },                                    
        }        
        const url_data = await dynamo.query(params).promise()        
        const return_data=url_data.Items[0]? url_data.Items[0].hash:"";        
        return response(200,return_data);
    }
    catch(err){
        return response(err.statusCode,err.message);
    }
}