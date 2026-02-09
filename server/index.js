const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/messages', (req, res) => {
  res.send(JSON.stringify([
    {
      text: 'asdlasldklsdk'
    }
  ]))
})

app.listen(port, () => {
  console.log(`Example app listening on port localhost:${port}`)
})
