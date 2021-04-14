const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const { v4: uuidv4 } = require('uuid');

const connectionTableName = process.env.connectionTableName;
const discussionTableName = process.env.discussionTableName;

exports.handler = async event => {
    console.log('event', event);

    const { connectionId: connectionID, routeKey, domainName, stage } = event.requestContext;
    try {
        switch (routeKey) {
            case '$connect':
                const connectionData = {
                    connectionId: connectionID,
                    date: Date.now(),
                    domainName,
                    stage,
                };

                await Dynamo.writeConnection(connectionData, connectionTableName);
                break;

            case '$disconnect':
                await Dynamo.delete(connectionID, connectionTableName);
                break;

            case 'message':
                console.log('New Message Feed ',event.body ,'Timestamp is' , Date.now())
                const body = JSON.parse(event.body);
                const record = await Dynamo.get(connectionID, connectionTableName);
                var messages = [];
                messages.push(body.message);
                const discussionData = {
                    discussionId: uuidv4(),
                    connectionId: connectionID,
                    ...record,
                    date: Date.now(),
                    messages,
                };
                await Dynamo.writeDiscussion(discussionData, discussionTableName);
                break;

            case '$default':
                console.log('event', event);
                break;
        }
        return Responses._200({ message: 'connected' });
    }
    catch (error) {
        return Responses._400({ message: 'message could not be received' });
    }

    return Responses._200({ message: 'connected' });
};
