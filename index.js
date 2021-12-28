const express = require('express')
const moment = require('moment')
const {SQSClient, SendMessageCommand, GetQueueAttributesCommand} = require("@aws-sdk/client-sqs");


const app = express()
const port = 3000
const sqsQueueURL = process.env.QUEUE_URL
const client = new SQSClient({});

app.get('/', (req, res) => {
    const command = new GetQueueAttributesCommand({
        QueueUrl: sqsQueueURL,
        AttributeNames: ["All"]
    })

    return client.send(command)
        .then((data) => {
            console.log(data)
            res.end(JSON.stringify(data))
        }).catch((err) => {
            console.log(err)
            res.status(500)
            res.end(JSON.stringify(err))
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
            res.end(JSON.stringify(data))
        }).catch((err) => {
            res.end(JSON.stringify(err))
        })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(1);
});