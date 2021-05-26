const AWS = require("aws-sdk");
const DT = require("date-and-time");
const crypto = require("crypto");
const dynamo = new AWS.DynamoDB.DocumentClient();
const Hashids = require("hashids");

function generateUniqueId() {
  const salt = crypto.randomBytes(16).toString("base64");
  const uniqueId = new Hashids(salt, 6);
  const id = uniqueId.encode(Math.ceil(Math.random() * 1000));
  return id;
}
function response(statusCode,error, message) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}

function generateTimestamp() {
  const ts = Date.now();
  const pattern = DT.compile("YYYY-MM-DD-HH-mm-ss");
  const timestamp = DT.format(new Date(ts), pattern);
  return timestamp;
}

exports.handler = async (event) => {
  const urlID = generateUniqueId();
  const reqBody = event.body;
  const timestamp = generateTimestamp();
  var visible=true    //public
  if(reqBody.visible==="false"||reqBody.visible===false){
    visible=false;    //private
  }
  const clicks_left=parseInt(reqBody.clicks_left);
  const url = {
    PK: `FILE#${event.path.fileId}`,
    SK: `URL#${timestamp}`,
    GS1_PK: `${urlID}`,
    hash: `${reqBody.hash}`,
    visible: visible,
    clicks_left: clicks_left ? clicks_left : 50,
  }
  const params = {
    TableName: "V-Transfer",
    Item: url,
  }
  try {
    await dynamo.put(params).promise();
    return response(201, undefined, url);
  } catch (err) {
    return response(500,"Internal Server Error",undefined);
  }
};
