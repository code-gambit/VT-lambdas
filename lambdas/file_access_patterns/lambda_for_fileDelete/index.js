const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
//AWS.config.loadFromPath("../../../keys.json");

function response(statusCode,error, message) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}
var request_item_arr=[]
function request_item_arr_util(url_record){
  var temp={
    "DeleteRequest" :{
      "Key":{
          "PK": "",
          "SK":""
      }
    }
  }
  temp.DeleteRequest.Key.PK=url_record.PK;
  temp.DeleteRequest.Key.SK=url_record.SK;
  request_item_arr.push(temp);
}

exports.handler = async (event) => {
  var params = {
    TableName: "V-Transfer",
    Key: {
      PK: `USER#${event.path.userId}`,
      SK: `FILE#${event.path.fileId}`,
    },
    ReturnValues: 'ALL_OLD'
  };
  //deleting the file details record
  try{
    var fileData = await dynamo.delete(params).promise()
  }
  catch(err){
    return response(500,"Internal Server Error",undefined);
  }

  //updating the storage_used for the user who deleted the file
  try{
    await dynamo.update({
      TableName: "V-Transfer",
      Key: {
        PK: `USER#${event.path.userId}`,
        SK: `METADATA`,
      },
      UpdateExpression: "add storage_used :size",
      ExpressionAttributeValues: {
        ":size": -fileData.Attributes.size,
      },
    }).promise()
  }
  catch(err){
    return response(500,"Internal Server Error",undefined);
  }

  params={
    TableName:"V-Transfer",
    KeyConditionExpression: "#PK= :pk and begins_with(#SK,:sk)",
    ExpressionAttributeNames:{
        "#PK": "PK",
        "#SK": "SK"
    },
    ExpressionAttributeValues:{
        ':pk':`FILE#${event.path.fileId}`,
        ':sk':"URL#"
    },
  }

  //getting all URLs corresponding to the deleted file record
  try{
    var url_data = await dynamo.query(params).promise()
    url_data=url_data.Items;
    if(url_data.length==0){
      return response(200,undefined,fileData.Attributes)
    }
  }
  catch(err){
    return response(500,"Internal Server Error",undefined);
  }

  url_data.forEach(request_item_arr_util)
  params={
    "RequestItems":{
      "V-Transfer":request_item_arr
    }
  }

  //deleting all URL records corresponding to the deleted file record
  try{
    await dynamo.batchWrite(params).promise()
    return  response(200,undefined,fileData.Attributes)
  }
  catch(err){
    return response(500,"Internal Server Error",undefined);
  }

}
