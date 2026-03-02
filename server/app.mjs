import express from 'express';
import bodyParser from 'body-parser';

import test_data from './test_data.json' with { type : 'json' };


const app = express();

const PORT = 3000;


app.get('/', (req, res) =>
{
    res.send('Hello World!');
});

app.get('/api/messages', (req, res) =>
{
    res.send(JSON.stringify(test_data));
});


app.post('/api/messages', bodyParser.text(), (req, res) =>
{
    console.log(req.body);
    res.send(null);
});


app.listen(PORT, () =>
{
    console.log(`Example app listening on port http://localhost:${PORT}/`);
});
