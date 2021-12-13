
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

            data.Messages.forEach((message) => {
                console.log("RECEIVED INFORMATION FROM QUEUE")
                console.log("BODY", message.Body)
                console.log("ATTRIBUTES", message.Attributes)
                console.log("===============================")

                const deleteMessageCommand = new DeleteMessageCommand({
                    QueueUrl: sqsQueueURL,
                    ReceiptHandle: message.ReceiptHandle
                })
            })

        },
        (error) => {
            console.log("ERROR RECEIVING INFORMATION FROM QUEUE")
            console.log(error)
            console.log("===============================")
        }
    );
}

setInterval(processMessage, 100)

