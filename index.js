const express = require('express')
const {SQSClient, SendMessageCommand} = require("@aws-sdk/client-sqs");


const app = express()
const port = 3000
const sqsQueueURL = process.env.QUEUE_URL
const client = new SQSClient({});

app.get('/', (req, res) => {
    console.log(process.env)
    res.send('Hello World!' + process.env.QUEUE_ARN)
})

app.get('/send-message', (req, res, next) => {

    const noOfMessage = req.query.noofmessage ? req.query.noofmessage : 50
    const promises = []
    for (let i = 0; i< noOfMessage; i++) {
        const command = new SendMessageCommand({
            MessageBody: `I am message number ${i} sent at ${moment().format('MMMM Do YYYY, h:mm:ss a')}`
        })
        promises.push(client.send(command))
    }

    return Promise.all(promises)
        .then((data) => {
            res.end(data)
        }).catch((err) => {
            res.status(500).end(err)
        })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})