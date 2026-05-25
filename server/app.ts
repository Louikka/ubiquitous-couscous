import os from 'node:os';
import path from 'node:path';

import express from 'express';
import redis from 'redis';
import { WebSocketServer } from 'ws';
import { expressjwt } from 'express-jwt';

import type * as APITypings from './types/api.d.ts';


const SERVER_PORT = 3000;
const WSS_PORT = 8080;

const jwtMiddleware = expressjwt({ 
    secret: 'shhhhhhared-secret', 
    algorithms: [ 'HS256', ], 
});


// const localIP = Object.values(os.networkInterfaces())
//     .flat()
//     .find(iface => iface !== undefined && iface.family === 'IPv4' && !iface.internal)
//     ?.address
// ;
//
// if (localIP !== undefined)
// {
//     console.debug(`local IP address found as ${localIP}`);
// }
// else
// {
//     console.error('Cannot find local IP address.');
//     console.log('defaulting to localhost...');
//     localIP = '127.0.0.1';
// }



/* Connect Redis *************************************************************/

const redisClient = redis.createClient(/*{ url : 'redis://localhost:39676', }*/);
redisClient.on('error', (err) =>
{
    console.error('Redis client error : ', err);
});

await redisClient.connect();

const getDBMessages = async () =>
{
    // get list of all message objects (stringified)
    const data = await redisClient.lRange('USER_MESSAGES', 0, -1);

    const messages: APITypings.Message[] = [];

    for (const d of data)
    {
        try
        {
            messages.push( JSON.parse(d) );
        }
        catch (err)
        {
            console.error('An error occured while trying to parse message from server : ', err);
            console.debug('Initial data that failed to parse : ', d);
        }
    }

    return messages;
};

const addDBMessage = async (message: APITypings.Message) =>
{
    await redisClient.rPush('USER_MESSAGES', JSON.stringify(message));
};



/* Initialize WebSocket ******************************************************/

const wss = new WebSocketServer({ port: WSS_PORT, });
console.debug(`Created WebSocketServer on port :${WSS_PORT}.`);

wss.on('connection', async (ws) =>
{
    console.debug(`WebSocket connection established.`);

    ws.on('error', (err) =>
    {
        console.error('WebSocketServer error : ', err);
    });

    ws.on('message', (data) =>
    {
        console.debug('WebSocketServer received some data...');
    });

    ws.on('close', (code, reason) =>
    {
        console.debug(`WebSocket connection closed (${code}).`);
    });


    // send all already existing messages
    // for (const message of await getDBMessages())
    // {
    //     ws.send(JSON.stringify(message));
    // }
});



/* Express routing ***********************************************************/

const app = express();


// serving `../frontend_simplified` on `/simple`
//app.use('/simple', express.static(path.join(import.meta.dirname, '../frontend_simplified/dist')));


app.get('/', (req, res) =>
{
    res.send(`
        <p>Hello, world!</p>
        <button onclick="
            console.debug('Sending test message...');
            fetch('http://localhost:${SERVER_PORT}/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timestamp: Date.now(),
                    user: 'TestUser',
                    text: 'test text',
                }),
            });
        ">Send test message</button>
    `);
});

app.get('/api/messages', jwtMiddleware, async (req, res) =>
{
    console.log(req);

    // get list of all message objects
    const messages = await getDBMessages();

    res.send(JSON.stringify(messages));
});


// middleware to parse req.body as JSON
app.use(express.json());

app.post('/api/messages', async (req, res) =>
{
    console.debug('Received new POST request. Processing...');

    const sendedMessage = req.body as APITypings.ChatMessage;

    if (sendedMessage.type !== 'message')
    {
        console.error(`Sended message of type "${sendedMessage.type}"; expected "message".`);
        // TODO : send response with error?
        return;
    }

    console.debug('Request processed successfully.');
    console.debug('Updating db and ws clients...');


    // adding new entry to the database

    // const DBMessages = await redisClient.lRange('messages', 0, -1);
    //
    // for (const s of DBMessages)
    // {
    //     const m = JSON.parse(s) as Message;
    //     if (m.id === message.parsed.id)
    //     {
    //         console.error(`Error : message with id="${message.parsed.id}" already exist in database.`);
    //         return;
    //     }
    // }

    addDBMessage(sendedMessage);


    // sending new message via ws

    for (const ws of wss.clients)
    {
        if (ws.readyState === ws.OPEN)
        {
            ws.send(JSON.stringify(sendedMessage));
        }
    }

    console.debug('Success!');
});


app.listen(SERVER_PORT, () =>
{
    console.log(`Server up and running on http://localhost:${SERVER_PORT}/`);
});
