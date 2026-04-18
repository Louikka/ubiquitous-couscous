import express from 'express';
import redis from 'redis';
import cors from 'cors';

import { WebSocketServer } from 'ws';


const SERVER_PORT = 8081;
const WSS_PORT = 8080;



/* Connect Redis *************************************************************/

const RedisClient = redis.createClient(/*{ url : 'redis://localhost:39676', }*/);
RedisClient.on('error', (err) =>
{
    console.error('Redis client error : ', err);
});

await RedisClient.connect();

const getDBMessages = async () =>
{
    // get list of all message objects (stringified)
    const data = await RedisClient.lRange('messages', 0, -1);

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



/* Initialize WebSocket ******************************************************/

const wss = new WebSocketServer({ port : WSS_PORT, });
console.debug(`Created WebSocketServer.`);

wss.on('connection', async (ws) =>
{
    console.debug(`WebSocket connection established!`);

    ws.on('error', (err) =>
    {
        console.error('WebSocketServer error : ', err);
    });

    ws.on('message', (data) =>
    {
        console.debug('WebSocketServer received some data...', data);
    });

    ws.on('close', (code, reason) =>
    {
        console.debug(`WebSocket connection closed.`);
    });


    // send all already existing messages

    const messages = await getDBMessages();

    for (const m of messages)
    {
        ws.send(JSON.stringify({
            type : 'message',
            content : m,
        } as WSSendData));
    }
});



/* Express routing ***********************************************************/

const app = express();

app.get('/', (req, res) =>
{
    res.send(`
        <p>Hello, world!</p>
    `);
});

app.get('/api/messages', async (req, res) =>
{
    // get list of all message objects
    const messages = await RedisClient.lRange('messages', 0, -1);

    res.send(messages);


    /* Uncomment next code if procession of the recieved data is needed. */

    // const data: Message[] = [];

    // for (let i = 0; i < messages.length; i++)
    // {
    //     try
    //     {
    //         data.push( JSON.parse(messages[i]) );
    //     }
    //     catch (err)
    //     {
    //         console.error('An error occured while trying to parse messages from server : ', err);
    //     }
    // }

    // res.send(JSON.stringify(data));
});


// set responses headers
app.use(cors())

// middleware to parse req.body as JSON
app.use(express.json());

app.post('/api/messages', async (req, res) =>
{
    console.debug('Received new POST request. Processing...');

    // let body_parsed: null | POSTReqBody = null;

    // try
    // {
    //     body_parsed = JSON.parse(req.body) as POSTReqBody;

    //     if (typeof body_parsed.content.id !== 'number')
    //     {
    //         throw new TypeError();
    //     }
    // }
    // catch (err)
    // {
    //     console.error('Failed to parse request body : ', err);
    //     console.debug('req.body : ', req.body);
    //     return;
    // }

    if (!Object.hasOwn(req.body, 'content'))
    {
        console.error('Request body does not have "content" property.');
        return;
    }

    console.debug('Request processed successfully.');
    console.debug('Updating db and ws clients...');


    // adding new entry to the database

    // const DBMessages = await RedisClient.lRange('messages', 0, -1);

    // for (const s of DBMessages)
    // {
    //     const m = JSON.parse(s) as Message;
    //     if (m.id === message.parsed.id)
    //     {
    //         console.error(`Error : message with id="${message.parsed.id}" already exist in database.`);
    //         return;
    //     }
    // }

    await RedisClient.rPush('messages', JSON.stringify(req.body.content));


    // sending new message via ws

    for (const ws of wss.clients)
    {
        if (ws.readyState === ws.OPEN)
        {
            const data: WSSendData = {
                type : 'message',
                content : req.body.content,
            };

            ws.send(JSON.stringify(data));
        }
    }

    console.debug('Success!');
});


app.listen(SERVER_PORT, () =>
{
    console.log(`Server listening on port http://localhost:${SERVER_PORT}/`);
});
