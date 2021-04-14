const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(connectionId, TableName) {
        const params = {
            TableName,
            Key: {
                connectionId,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for ID of ${connectionId} from ${TableName}`);
        }
        console.log(data);

        return data.Item;
    },

    async getDiscussion(connectionID, TableName) {

        console.log("Enter into discussions dynamo ");
        const params = {
            TableName,
            FilterExpression: "#connectionId = :connectionIdVal",
            ExpressionAttributeNames: {
                "#connectionId": "connectionId",
            },
            ExpressionAttributeValues: { ":connectionIdVal": connectionID }
        };
        console.log("Before dynamo call ",params);
        const data = await documentClient.get(params).promise();
        console.log("After dynamo call ", data);

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for ID of ${discussionId} from ${TableName}`);
        }
        console.log(data);

        return data.Item;
    },


    async writeConnection(data, TableName) {
        if (!data.connectionId) {
            throw Error('no ID on the data');
        }

        const params = {
            TableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(`There was an error inserting ID of ${data.connectionId} in table ${TableName}`);
        }

        return data;
    },

    async writeDiscussion(data, TableName) {
        if (!data.discussionId) {
            throw Error('no ID on the data');
        }

        const params = {
            TableName,
            Item: data,
        };
        const res = await documentClient.put(params).promise();
        if (!res) {
            throw Error(`There was an error inserting ID of ${data.discussionId} in table ${TableName}`);
        }
        return data;
    },

    async delete(connectionId, TableName) {
        const params = {
            TableName,
            Key: {
                connectionId,
            },
        };

        return documentClient.delete(params).promise();
    },
};
module.exports = Dynamo;
