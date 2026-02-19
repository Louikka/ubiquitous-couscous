import express from 'express';

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


app.listen(PORT, () =>
{
    console.log(`Example app listening on port http://localhost:${PORT}/`);
});
