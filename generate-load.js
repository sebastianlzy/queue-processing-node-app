
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");


// const sqsQueueURL = process.env.QUEUE_URL
// const client = new SQSClient({});


const main = () => {
    console.log("PRINT ALL ENV VARIABLE")
    console.log(process.env)



    console.log("I AM A LAMBDA FUNCTION")

    console.log()
}

