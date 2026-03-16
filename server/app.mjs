import express from 'express';
import bodyParser from 'body-parser';
import redis from 'redis';
import { WebSocketServer } from 'ws';


const app = express();

const redisClient = redis.createClient(/*{ url : 'redis://localhost:39676', }*/);
redisClient.on('error', (err) => console.error(err));

const wss = new WebSocketServer({ port : 8080, });
wss.on('connection', function connection(ws) 
{
    ws.on('error', console.error);

    ws.on('message', function message(data) 
    {
        console.log('received: %s', data);
    });

    ws.send('something');
});

const PORT = 3000;


await redisClient.connect();


app.get('/', (req, res) =>
{
    res.send('Hello World!');
});

app.get('/api/messages', async (req, res) =>
{
    const _messages = await redisClient.lRange('messages', 0, -1);

    /** @type {Message[]} */
    const data = [];

    for (let i = 0; i < _messages.length; i++)
    {
        data.push({
            id : i,
            origin : 'left',
            text : _messages[i],
        });
    }

    res.send(JSON.stringify(data));
});


app.post('/api/messages', bodyParser.text(), async (req, res) =>
{
    const rBody = req.body;

    await redisClient.rPush('messages', rBody);
    res.send();

    const _listLen = await redisClient.lLen('messages');

    wss.clients.forEach((wsClient) =>
    {
        if (wsClient.OPEN)
        {
            wsClient.send(JSON.stringify({ 
                id : _listLen - 1, 
                origin : 'left',
                text : rBody,
            }));
        }
    });
});


app.listen(PORT, () =>
{
    console.log(`Example app listening on port http://localhost:${PORT}/`);
});
