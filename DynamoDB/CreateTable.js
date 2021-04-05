var AWS = require("aws-sdk");
var keys = require("../keys.json");


AWS.config.update({
  region: keys.region,
  endpoint: keys.endpoint
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "V-Transfer",
    KeySchema: [       
        { AttributeName: "PK", KeyType: "HASH"},  //Partition key
        { AttributeName: "SK", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" },
        { AttributeName: "u_id", AttributeType: "S" },
        { AttributeName: "data", AttributeType: "S"}
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [{
        IndexName: "Find_file",
        KeySchema: [
            {
                AttributeName: "u_id",
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
        IndexName: "Filter_by_name",
        KeySchema: [
            {
                AttributeName: "PK",
                KeyType: "HASH"
                },
            {
                AttributeName: "data",
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