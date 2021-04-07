var AWS = require("aws-sdk");
var keys = require("./keys.json");


AWS.config.update({
  region: keys.region,
  endpoint: keys.endpoint
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "VT-root",
    KeySchema: [
        { AttributeName: "PK", KeyType: "HASH"},  //Partition key
        { AttributeName: "SK", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" },
        { AttributeName: "GS1_PK", AttributeType: "S" },
        { AttributeName: "LS1_SK", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [{
        IndexName: "FIND_FILE_BY_URL",
        KeySchema: [
            {
                AttributeName: "GS1_PK",
                KeyType: "HASH"
            }
        ],
        Projection: {
            ProjectionType: "ALL"
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    }],
    LocalSecondaryIndexes: [{
        IndexName: "FIND_FILE_BY_NAME",
        KeySchema: [
            {
                AttributeName: "PK",
                KeyType: "HASH"
                },
            {
                AttributeName: "LS1_SK",
                KeyType: "RANGE"
                }
        ],
        Projection: {
            ProjectionType: "ALL"
        }
    }]
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
