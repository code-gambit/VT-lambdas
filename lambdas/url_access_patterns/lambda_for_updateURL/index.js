/**
* This lambda takes the fileld, urlId and URL object and update the URL 
* corresponding to the given urlId.
* @listens API Gateway: PUT /file/:fileId/url/:urlId
* @see {@link https://app.swaggerhub.com/apis-docs/code-gambit/V-Transfer/1.0.0}
*/
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error, message) {
    return {
        statusCode: statusCode,
        body: message,
        error:error
    };
}
/**
* Checks if string is null or not based on custom conditions
* @param {String} stringData The string to check null for
* @return {Boolean} Tells whether [stringData] is null or not
*/
function nullCheck(stringData) {
    return stringData!=="undefined" && stringData!=="null" && stringData!==""
}
/**
* validate the string passed based on [nullCheck]
* @param {String} queryString The string to be validated
* @return {Boolean} Tells whether [queryString] is valid or not
*/
function isValidParam(queryString) {
    if (queryString && nullCheck(queryString) ) {
        return true
    }
        return false
}
/**
* convert the passed string to boolean
* @param {String} queryString The string to be converted
* @return {Boolean} The converted string in boolean
*/
function getBoolean(queryString) {
    if(queryString==="false"||queryString===false){
        return false;
    }
    return true;
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
    if(isValidParam(reqBody.visible) && isValidParam(reqBody.clicks_left)){  //request to change visibility and clicks_left
        params.UpdateExpression="set visible = :val1, clicks_left = :val2"
        params.ExpressionAttributeValues={":val1":getBoolean(reqBody.visible),":val2":parseInt(reqBody.clicks_left)}
    }
    else if(isValidParam(reqBody.visible)){    //request to change  visiblity of url
        params.UpdateExpression="set visible = :val"
        params.ExpressionAttributeValues= {":val":getBoolean(reqBody.visible)}
    }
    else if(isValidParam(reqBody.clicks_left)){   //request to update clicks_left for url
        params.UpdateExpression="set clicks_left = :val"
        params.ExpressionAttributeValues= {":val":parseInt(reqBody.clicks_left)}
    }
    try{
        const updated_url_data=  await dynamo.update(params).promise();
        return response(201,undefined,updated_url_data.Attributes);
    }catch(err){
        return response(500,"Internal Server Error",undefined);
    }
}