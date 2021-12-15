const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    console.log(process.env)
    res.send('Hello World!' + process.env.QUEUE_ARN)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})