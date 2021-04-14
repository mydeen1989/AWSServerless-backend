const Responses = require('../common/API_Responses');
const WebSocket = require('../common/websocketMessage');

exports.handler = async event => {
    console.log(`The following happend in the DynamoDB database table "users":\n${JSON.stringify(event.Records[0].dynamodb, null, 2)}`);
    try {
        var connectionId = event.Records[0].dynamodb.NewImage.connectionId.S;
        var stage = event.Records[0].dynamodb.NewImage.stage.S;
        var domainName = event.Records[0].dynamodb.NewImage.domainName.S;
        var reponseMessage = event.Records[0].dynamodb.NewImage.messages.L[0].S;
        console.log('response Message', reponseMessage)
        await WebSocket.send({
            domainName,
            stage,
            connectionId,
            message: reponseMessage,
        });
        console.log('Response message ', reponseMessage , 'Timestamp is ', Date.now());
        return Responses._200({ message: 'got a message' });
    } catch (error) {
        return Responses._400({ message: 'message could not be received' });
    }

    return Responses._200({ message: 'got a message' });
};
