import express from 'express';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

import { RedisClient } from './lib/db.ts';
import { verifyPassword } from './lib/lib.ts';
import type { API } from './types/api.d.ts';


const SERVER_PORT = 3000;
const WSS_PORT = 8080;

const CRYPTO_KEY = '123';
const JWT_PRIVATE_KEY = 'shhhhh';



/* Connect Redis *************************************************************/

const db = new RedisClient();
await db.connect();



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
});



/* Express routing ***********************************************************/

const app = express();

// middleware to parse req.body as JSON
app.use(express.json());


app.get('/', (req, res) =>
{
    res.send(`<p>Hello, world!</p>`);
});


app.post('/api/register', async (req, res) =>
{
    const { username, password } = req.body;

    if (await db.isUserExists(username))
    {
        // user already exists
        res.status(401).end();
        return;
    }

    db.addNewUser(username, password);

    res.json({
        token: jwt.sign({ username, }, JWT_PRIVATE_KEY),
    } as API.register.post.res.body);
});


app.post('/api/login', async (req, res) =>
{
    const { username, password } = req.body;

    const user = await db.getUser(username);

    if (user === null || !verifyPassword(password, user.password, user.salt))
    {
        // user does not exists or credentials are wrong
        res.status(401).end();
        return;
    }

    res.json({
        token: jwt.sign({ username, }, JWT_PRIVATE_KEY),
    } as API.login.post.res.body);
});


app.get('/api/messages', async (req, res) =>
{
    res.send(await db.getChatMessages());
});

app.post('/api/messages', async (req, res) =>
{
    const chatMessage = req.body as API.messages.post.req.body;
    console.debug(`New message :`, chatMessage);

    if (chatMessage === undefined)
    {
        console.error(`Cannot parse request's body (returns "undefined").`);
        // TODO : send response with error?
        return;
    }

    db.addChatMessage(chatMessage);


    // sending new message via ws
    for (const ws of wss.clients)
    {
        if (ws.readyState === ws.OPEN)
        {
            ws.send(JSON.stringify(chatMessage));
        }
    }
});



app.listen(SERVER_PORT, () =>
{
    console.log(`Server up and running on http://localhost:${SERVER_PORT}/`);
});
