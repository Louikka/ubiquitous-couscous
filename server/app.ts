import express from 'express';
import redis from 'redis';

import { WebSocketServer } from 'ws';


const SERVER_PORT = 9000;
const WSS_PORT = SERVER_PORT + 1;



/* Initialize WebSocket ******************************************************/

const wss = new WebSocketServer({ port : WSS_PORT, });
console.debug(`Created WebSocketServer on port ${WSS_PORT}.`);

wss.on('connection', (ws) =>
{
    console.debug(`WebSocket connection established at ws://localhost:${WSS_PORT}!`);

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
        console.debug(`WebSocket connection closed.`);
    });
});



/* Connect Redis *************************************************************/

const RedisClient = redis.createClient(/*{ url : 'redis://localhost:39676', }*/);
RedisClient.on('error', (err) =>
{
    console.error('Redis client error : ', err);
});

await RedisClient.connect();



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


// middleware to parse req.body as JSON
app.use(express.json());

app.post('/api/messages', async (req, res) =>
{
    console.debug('Received new POST request. Processing...');

    /**
     * `req.body` has `content` property (see {@link POSTReqBody}) which
     * consist (or, at least, should) of stringified {@link Message}
     * object.
     */
    const body = req.body as POSTReqBody;
    const message: {
        readonly s: string;
        parsed: null | Message;
    } = {
        s : body.content,
        parsed : null,
    };


    try
    {
        message.parsed = JSON.parse(message.s) as Message;

        if (typeof message.parsed.id !== 'number')
        {
            throw new TypeError();
        }
    }
    catch (err)
    {
        console.error('Failed to parse request body : ', err);
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

    await RedisClient.rPush('messages', message.s);


    // sending new message via ws

    for (const ws of wss.clients)
    {
        if (ws.readyState === ws.OPEN)
        {
            const data: WSSendData = {
                type : 'message',
                content : message.parsed,
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
