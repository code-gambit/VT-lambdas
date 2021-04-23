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
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: message,
  };
}

function generateTimestamp() {
  const ts = Date.now();
  const pattern = DT.compile("YYYY-MM-DD-HH-mm-ss");
  const timestamp = DT.format(new Date(ts), pattern);
  return timestamp;
}

exports.generateURL = async (event) => {
  const urlID = generateUniqueId();
  const reqBody = event.body;
  const timestamp = generateTimestamp();
  try {
    await dynamo
      .put({
        TableName: "V-Transfer",
        Item: {
          PK: `FILE#${event.path.f_timestamp}`,
          SK: `URL#${timestamp}`,
          GS1_PK: `${urlID}`,
          hash: `${reqBody.hash}`,
          visible: `${reqBody.visible}`,
          clicks_left: reqBody.clicks_left ? reqBody.clicks_left : 50,
        },
      })
      .promise();
    return response(200, urlID);
  } catch (err) {
    return response(200, err.message);
  }
};
