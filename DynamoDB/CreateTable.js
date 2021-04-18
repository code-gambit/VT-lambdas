var AWS = require("aws-sdk");

/*Use this for AWS Console*/
AWS.config.loadFromPath('../keys.json');

/*Use this for local setup*/
// AWS.config.update({
//   region: "local",
//   endpoint: "http://localhost:8000"
// });

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
        { AttributeName: "GS1_PK", AttributeType: "S" },
        { AttributeName: "LS1_SK", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    },
    GlobalSecondaryIndexes: [{
        IndexName: "FIND_FILE_BY_URLID",
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
