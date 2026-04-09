import express from 'express';
import redis from 'redis';


const SERVER_PORT = 9000;
const WSS_PORT = SERVER_PORT + 1;



/* Initialize WebSocket ******************************************************/

// https://nodejs.org/learn/getting-started/websocket

const _ws_url = `ws://localhost:${WSS_PORT}`;
const ws = new WebSocket(_ws_url);
ws.addEventListener('open', (ev) =>
{
    console.log(`WebSocket connection established at ${_ws_url} !`);

    const data = { type : 'text', content : 'Hello from Node.js!', };
    ws.send(JSON.stringify(data));
});
ws.addEventListener('message', (ev) =>
{
    try
    {
        const d = JSON.parse(ev.data);
        console.log('Received JSON : ', d);
    }
    catch (err)
    {
        console.error('Error parsing JSON : ', err);
        console.log('|____ Received data was : ', ev.data);
    }
});
ws.addEventListener('close', (ev) =>
{
    console.log('WebSocket connection closed :', ev.code, ev.reason);
});
ws.addEventListener('error', (ev) =>
{
    console.error('----- WebSocket error.');
});



/* Connect Redis *************************************************************/

const RedisClient = redis.createClient(/*{ url : 'redis://localhost:39676', }*/);
RedisClient.on('error', (err) => console.error('Redis client error : ', err));

await RedisClient.connect();



/* Express routing ***********************************************************/

const app = express();

app.get('/', (req, res) =>
{
    res.send('Hello World!');
});

app.get('/api/messages', async (req, res) =>
{
    // get list of all message objects
    const messages = await RedisClient.lRange('messages', 0, -1);

    res.send(messages);


    // Uncomment next code if procession of the recieved data is needed.

    // /** @type {Message[]} */
    // const data = [];

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
    //console.log(req.body);

    // stringified Message object
    /** See {@link POSTReqBody}. */
    const bodyContent = req.body.content;

    await RedisClient.rPush('messages', bodyContent);
    res.send('Request successfull.');


    if (ws.readyState === ws.OPEN)
    {
        const data = { type : 'message', content : bodyContent, };
        ws.send(JSON.stringify(data));
    }
});


app.listen(SERVER_PORT, () =>
{
    console.log(`Example app listening on port http://localhost:${SERVER_PORT}/`);
});
