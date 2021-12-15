
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");


const sqsQueueURL = process.env.QUEUE_URL
const client = new SQSClient({});
console.log("PRINT ALL ENV VARIABLE")
console.log(process.env)


const processMessage = () => {
    const receiveMessageCommand = new ReceiveMessageCommand({
        QueueUrl: sqsQueueURL
    })


    client.send(receiveMessageCommand).then(
        (data) => {

            if (data.Messages) {
                data.Messages.forEach((message) => {
                    const receiptHandle = message.ReceiptHandle
                    const body = message.Body
                    console.log(`[Processing 500 ms] ${body}, ${receiptHandle}`)
                    setTimeout(() => {
                        new DeleteMessageCommand({
                            QueueUrl: sqsQueueURL,
                            ReceiptHandle: receiptHandle
                        })
                        console.log(`[Deleted] ${body}, ${receiptHandle}`)
                    }, 500)
                })
            }


        },
        (error) => {
            console.log("ERROR RECEIVING INFORMATION FROM QUEUE")
            console.log(error)
            console.log("===============================")
        }
    );
}

setInterval(processMessage, 100)

