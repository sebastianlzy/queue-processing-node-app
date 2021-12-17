const {SQSClient, ReceiveMessageCommand, DeleteMessageCommand} = require("@aws-sdk/client-sqs");
const moment = require('moment')

const sqsQueueURL = process.env.QUEUE_URL
const client = new SQSClient({});

const deleteMessage = (receiptHandle, body, timeout = 500) => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            new DeleteMessageCommand({
                QueueUrl: sqsQueueURL,
                ReceiptHandle: receiptHandle
            })
            client.send(new DeleteMessageCommand({
                QueueUrl: sqsQueueURL,
                ReceiptHandle: receiptHandle
            }))
                .then(() => resolve(body))
                .catch((err) => reject(err))

        }, timeout)
    })

}


const processMessage = () => {
    console.log(`Running process message @ ${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
    const receiveMessageCommand = new ReceiveMessageCommand({
        QueueUrl: sqsQueueURL
    })

    client.send(receiveMessageCommand)
        .then((data) => data.Messages ? data.Messages : [])
        .then((messages) => {
            const promises = messages.map((message) => {
                const receiptHandle = message.ReceiptHandle
                const body = message.Body
                console.log(`[Processing 500 ms] ${body}`)
                return deleteMessage(receiptHandle, body, 500)
            })
            return Promise.all(promises)
        })
        .then((responses) => {
            responses.forEach((body) => {
                console.log(`[Deleted] ${body}`)
            })
        })
        .catch((error) => {
            console.log("ERROR RECEIVING INFORMATION FROM QUEUE")
            console.log(error)
            console.log("===============================")
        })
}

setInterval(processMessage, 5000)

