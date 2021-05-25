const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();+

function response(statusCode,error=undefined, message=undefined) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}

exports.handler = async (event) =>{
    const reqBody = event.body;
    var params = {
        TableName:"V-Transfer",
        Key: {
            PK: `FILE#${event.path.fileId}`,
            SK: `URL#${event.path.urlId}`,
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
        return response(200,message=updated_url_data.Attributes);
    }catch(err){
        return response(500,error="Internal Server Error");;
    }
}
