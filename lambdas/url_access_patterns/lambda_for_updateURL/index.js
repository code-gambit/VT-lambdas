const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();+

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: message,
  };
}

exports.updateURL = async (event) =>{
    const reqBody = event.body;
    var params = {
        TableName:"V-Transfer",
        Key: {
            PK: `FILE#${event.path.f_timestamp}`,
            SK: `URL#${reqBody.u_timestamp}`,
        },
        ReturnValues:"ALL_NEW"
    }
    if(reqBody.visible!=undefined){    //request to change  visiblity of url
        params.UpdateExpression="set visible = :val"
        params.ExpressionAttributeValues= {":val":reqBody.visible}
    }
    else if(reqBody.clicks_left!=undefined){   //request to update clicks_left for url
        params.UpdateExpression="set clicks_left = :val"
        params.ExpressionAttributeValues= {":val":reqBody.clicks_left}
    }
    try{
        const updated_url_data=  await dynamo.update(params).promise();
        return response(200,updated_url_data.Attributes);
    }catch(err){
        return response(err.statusCode,err.message)
    }
}