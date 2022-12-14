const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const client = new SQSClient({
  region: "us-east-2",
});

exports.sendToSQS = async (topic, MessageBody, QueueUrl) => {
  return await client.send(
    new SendMessageCommand({
      DelaySeconds: 0,
      MessageAttributes: {
        Topic: {
          DataType: "string",
          StringValue: topic.toUpperCase(),
        },
      },
      MessageBody,
      QueueUrl,
    })
  );
};
