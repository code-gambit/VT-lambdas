const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

function response(statusCode,error, message) {
  return {
    statusCode: statusCode,
    body: message,
    error:error
  };
}
function jsonToBase64(json_data){
    if(json_data === undefined) return json_data;
    let encoded = Buffer.from(JSON.stringify(json_data), 'ascii').toString('base64');
    return encoded;
}
function base64ToJson(bString){
    if (bString === undefined || bString === "undefined" || bString === "null" || bString === "") return undefined
    let decoded = JSON.parse(Buffer.from(bString, 'base64').toString('ascii'));
    return decoded;
}
/**
* Validates the date query string after parsing
* @param {String} queryString The date query string
* @return {String | undefined} If queryString is valid(contains year, month and
* day) it returns the query string itself else returns undefined
*/
function parseDateQuery(queryString) {
  var arr = queryString.split('-')
  if (arr.length == 3) {
      var data = {
        year: parseInt(arr[0]),
        month: parseInt(arr[1]),
        day: parseInt(arr[2])
      }
      if (data.year && data.month && data.day) {
          return queryString
      } else {
          return undefined
      }
  } else {
    return undefined
  }
}
/**
* returns the date in string format [YYYY-MM-DD]
* @return {String} The current date in YYYY-MM-DD formay
*/
function getTodayFormatedDate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy+"-"+mm+"-"+dd
  return parseDateQuery(today)
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
function isValidString(queryString) {
  if (queryString && nullCheck(queryString) ) {
    return true
  }
    return false
}

exports.handler = async (event) =>{
    try{
        const params = {
            TableName:"V-Transfer",
            ScanIndexForward: false,
            KeyConditionExpression: "#PK= :pk and ",
            ScanIndexForward: false,
            ExpressionAttributeNames:{ "#PK": "PK", "#SK": "SK" },
            ExpressionAttributeValues:{ ':pk':`USER#${event.path.userId}` },
            Limit:10,
        }
        const searchParam = event.query.searchParam;
        var isSearchQuery = isValidString(searchParam)
        var start = event.query.start
        var end = event.query.end
        if (!isSearchQuery){
            if (isValidString(start)) {
                start = parseDateQuery(start)
                if (start == undefined) { throw "Invalid start query" }
                if (isValidString(end)) {
                    end = parseDateQuery(end)
                    if (end == undefined) { throw "Invalid end query" }
                } else { end = getTodayFormatedDate() }
                params.KeyConditionExpression += "#SK BETWEEN :st AND :en";
                params.ExpressionAttributeValues[":st"] = `FILE#${start}-00-00-00`;
                params.ExpressionAttributeValues[":en"] = `FILE#${end}-99-99-99`;
            } else {
                params.KeyConditionExpression += "begins_with(#SK,:sk)";
                params.ExpressionAttributeValues[":sk"] = "FILE#"
            }
        } else {
            params.KeyConditionExpression += "begins_with(#SK,:sk)";
            params.IndexName="FIND_FILE_BY_NAME";
            params.ExpressionAttributeNames["#SK"] = "LS1_SK";
            params.ExpressionAttributeValues[":sk"] = searchParam;
        }
        const lastEvaluatedKey = base64ToJson(event.query.LastEvaluatedKey);
        if (lastEvaluatedKey && isValidString(event.query.LastEvaluatedKey)) {
            params.ExclusiveStartKey = lastEvaluatedKey;
        }
        const file_data = await dynamo.query(params).promise()
        var return_data={}
        return_data.items=file_data.Items
        file_data.LastEvaluatedKey!=undefined?return_data.LastEvaluatedKey =
        jsonToBase64(file_data.LastEvaluatedKey):"";
        return  response(200,undefined,return_data);
    }
    catch(err){
        return response(500,"Internal Server Error",undefined);
    }
}
