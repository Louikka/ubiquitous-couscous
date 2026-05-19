import os from 'node:os';
import path from 'node:path';

import express from 'express';
import redis from 'redis';
import { WebSocketServer } from 'ws';


const SERVER_PORT = 3000;
const WSS_PORT = 8080;


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
    const data = await redisClient.lRange('messages', 0, -1);

    const messages: Message[] = [];

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

const addDBMessage = async (message: Message) =>
{
    await redisClient.rPush('messages', JSON.stringify(message));
};



/* Initialize WebSocket ******************************************************/

const wss = new WebSocketServer({ port : WSS_PORT, });
console.debug(`Created WebSocketServer on port :${WSS_PORT}.`);

wss.on('connection', async (ws) =>
{
    console.debug(`WebSocket connection established at ${ws.url}!`);

    ws.on('error', (err) =>
    {
        console.error('WebSocketServer error : ', err);
    });

    ws.on('message', (data) =>
    {
        //console.debug('WebSocketServer received some data...');
    });

    ws.on('close', (code, reason) =>
    {
        console.debug(`WebSocket connection closed (${code}).`);
    });


    // send all already existing messages
    for (const message of await getDBMessages())
    {
        ws.send(JSON.stringify({
            type : 'message',
            content : message,
        } as WSSendData));
    }
});



/* Express routing ***********************************************************/

const app = express();


// serving `../frontend_simplified` on `/simple`
//app.use('/simple', express.static(path.join(import.meta.dirname, '../frontend_simplified/dist')));


app.get('/', (req, res) =>
{
    res.send(`
        <p>Hello, world!</p>
    `);
});

app.get('/api/messages', async (req, res) =>
{
    // get list of all message objects
    const messages = await getDBMessages();

    res.send(JSON.stringify(messages));


    /* Uncomment next code if procession of the recieved data from db is needed. */

    // const data: Message[] = [];
    //
    // for (let i = 0; i < messages.length; i++)
    // {
    //     try
    //     {
    //         const message = JSON.parse(messages[i]);
    //
    //         // do some stuff...
    //
    //         data.push(message);
    //     }
    //     catch (err)
    //     {
    //         console.error('An error occured while trying to parse messages from server : ', err);
    //     }
    // }
    //
    // res.send(JSON.stringify(data));
});


// middleware to parse req.body as JSON
app.use(express.json());

app.post('/api/messages', async (req, res) =>
{
    console.debug('Received new POST request. Processing...');

    const sendedMessage = req.body as Message;

    if (!Object.hasOwn(sendedMessage, 'id'))
    {
        console.error('Unable to read request\'s body.');
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
            const data: WSSendData = {
                type : 'message',
                content : sendedMessage,
            };

            ws.send(JSON.stringify(data));
        }
    }

    console.debug('Success!');
});


app.listen(SERVER_PORT, () =>
{
    console.log(`Server up and running on http://localhost:${SERVER_PORT}/`);
});
