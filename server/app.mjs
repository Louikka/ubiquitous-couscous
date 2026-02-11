import express from 'express';


const app = express();

const PORT = 3000;


app.get('/', (req, res) =>
{
    res.send('Hello World!');
});

app.get('/messages', (req, res) =>
{
    res.send(JSON.stringify([
        {
            text : 'text example',
        },
    ]));
});


app.listen(PORT, () =>
{
    console.log(`Example app listening on port http://localhost:${PORT}/`);
});
