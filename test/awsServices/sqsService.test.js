const { expect } = require("chai");
const { mockClient } = require("aws-sdk-client-mock");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const client = mockClient(SQSClient);
const service = require("../../src/awsservices/sqsService");
describe("sqsService test", () => {
  beforeEach(() => {
    client.reset();
  });
  it("sendToSQS", async () => {
    client.on(SendMessageCommand).resolves({});
    const rs = await service.sendToSQS("any", "any", "any");
    expect(rs).not.equal(undefined);
  });
});
