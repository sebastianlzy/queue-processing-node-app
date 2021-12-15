const express = require('express')
const {SQSClient, SendMessageCommand, GetQueueAttributesCommand} = require("@aws-sdk/client-sqs");


const app = express()
const port = 3000
const sqsQueueURL = process.env.QUEUE_URL
const client = new SQSClient({});

app.get('/', (req, res) => {
    console.log(process.env)
    const command = new GetQueueAttributesCommand({
        QueueUrl: sqsQueueURL
    })

    return client.send(command)
        .then((data) => {
            res.end(data)
        }).catch((err) => {
            res.status(500).end(err)
        })
})

app.get('/send-message', (req, res) => {

    const noOfMessage = req.query.noofmessage ? req.query.noofmessage : 50
    const promises = []
    for (let i = 0; i< noOfMessage; i++) {
        const command = new SendMessageCommand({
            QueueUrl: sqsQueueURL,
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