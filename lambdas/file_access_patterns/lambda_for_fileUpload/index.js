const AWS = require("aws-sdk");
const Lambda = new AWS.Lambda()
const DT = require("date-and-time");
//AWS.config.loadFromPath("../../../keys.json");
const dynamo = new AWS.DynamoDB.DocumentClient();
const error_message = 'Internal Server Error';
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

/**
 * Returns the stringify payload used for invoking ggenerate url lambda
 * @param {String} fileHash hash of the file
 * @param {String} fileId id if file, without FILE# prefix
 * @returns stringify payload used for invoking ggenerate url lambda
 */
function getGenerateUrlPayload(fileHash, fileId) {
    const payload = {
        method: "INVOKE",
        url: `https://mhv71te0rh.execute-api.ap-south-1.amazonaws.com/beta/file/${fileId}/url`,
        body: { visible: true, hash: fileHash, clicks_left: 50 },
        query: {},
        path: { fileId: fileId }
    }
    return JSON.stringify(payload)
}

exports.handler = async (event) => {
  const reqBody = event.body;
  var d = new Date();
  const timestamp = generateTimestamp();
  const file = {
    PK: `USER#${event.path.userId}`,
    SK: `FILE#${timestamp}`,
    LS1_SK: reqBody.LS1_SK,
    size: reqBody.size,
    hash: reqBody.hash,
    f_type: reqBody.f_type,
  };

  let generateUrlTask;
  const params = { FunctionName: 'lambda_for_generateURL', InvocationType: 'RequestResponse',
    Payload: getGenerateUrlPayload(file.hash, file.SK.split('#')[1])
  }
  try {
    const res = await Lambda.invoke(params).promise()
    generateUrlTask = JSON.parse(res.Payload)
} catch(err) { return response(500, error_message, undefined) }
  file.default = generateUrlTask.Item.GS1_PK
  const filePutTask = { TableName:"V-Transfer", Item: file }
  const userMetaDataUpdateTask = { TableName: "V-Transfer",
    Key: { PK: `USER#${event.path.userId}`, SK: `METADATA` },
    UpdateExpression: "add storage_used :file_size",
    ExpressionAttributeValues: { ":file_size": reqBody.size }
  }

  const param = {
    TransactItems: [{ Put: filePutTask }, { Update: userMetaDataUpdateTask }, { Put: generateUrlTask }]
  }

  try {
    await dynamo.transactWrite(param).promise()
    return response(200, undefined, file)
  } catch (err) {
    return response(500, error_message, undefined)
  }

}
