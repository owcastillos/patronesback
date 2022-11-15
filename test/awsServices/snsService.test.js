const { expect } = require("chai");
const { mockClient } = require("aws-sdk-client-mock");
const {
  SNSClient,
  CreateSMSSandboxPhoneNumberCommand,
  VerifySMSSandboxPhoneNumberCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  ListSubscriptionsCommand,
  PublishBatchCommand,
} = require("@aws-sdk/client-sns");
const client = mockClient(SNSClient);
const service = require("../../src/awsservices/snsService");
describe("snsService test", () => {
  beforeEach(() => {
    client.reset();
  });
  it("addPhoneNumber", async () => {
    client.on(CreateSMSSandboxPhoneNumberCommand).resolves({});
    const rs = await service.addPhoneNumber("any");
    expect(rs).not.equal(undefined);
  });
  it("verifyPhoneNumber", async () => {
    client.on(VerifySMSSandboxPhoneNumberCommand).resolves({});
    const rs = await service.verifyPhoneNumber("any", "any");
    expect(rs).not.equal(undefined);
  });
  it("subscribeEndpoint SMS", async () => {
    client.on(SubscribeCommand).resolves({});
    const rs = await service.subscribeEndpoint("any", service.PROTOCOLS.SMS);
    expect(rs).not.equal(undefined);
  });
  it("subscribeEndpoint EMAIL", async () => {
    client.on(SubscribeCommand).resolves({});
    const rs = await service.subscribeEndpoint("any", service.PROTOCOLS.EMAIL);
    expect(rs).not.equal(undefined);
  });
  it("unsubscribeEndpoint", async () => {
    client.on(UnsubscribeCommand).resolves({});
    const rs = await service.unsubscribeEndpoint("any");
    expect(rs).not.equal(undefined);
  });
  it("listSubscriptionByParams", async () => {
    client
      .on(ListSubscriptionsCommand)
      .resolvesOnce({
        Subscriptions: [
          {
            Endpoint: "sms0",
          },
        ],
        NextToken: "nextToken",
      })
      .resolves({
        Subscriptions: [
          {
            Endpoint: "sms1",
          },
          {
            Endpoint: "email",
          },
        ],
      });
    const rs = await service.listSubscriptionByParams(["sms"]);
    expect(rs.length).equal(2);
  });
  it("publishNotification", async () => {
    client.on(PublishBatchCommand).resolves({});
    const rs = await service.publishNotification("any", "any");
    expect(rs).not.equal(undefined);
  });
});
