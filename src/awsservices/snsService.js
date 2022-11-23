const {
  SNSClient,
  CreateSMSSandboxPhoneNumberCommand,
  VerifySMSSandboxPhoneNumberCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  ListSubscriptionsCommand,
  PublishBatchCommand,
} = require("@aws-sdk/client-sns");

const client = new SNSClient({
  region: "us-east-2",
});

const PROTOCOLS = {
  SMS: "sms",
  EMAIL: "email",
};

exports.PROTOCOLS = PROTOCOLS;

exports.addPhoneNumber = async (phoneNumber) => {
  return await client.send(
    new CreateSMSSandboxPhoneNumberCommand({
      LanguageCode: "es-419",
      PhoneNumber: `+57${phoneNumber}`,
    })
  );
};

exports.verifyPhoneNumber = async (phoneNumber, OneTimePassword) => {
  return await client.send(
    new VerifySMSSandboxPhoneNumberCommand({
      OneTimePassword,
      PhoneNumber: `+57${phoneNumber}`,
    })
  );
};

exports.subscribeEndpoint = async (TopicArn, Protocol, endpoint) => {
  return await client.send(
    new SubscribeCommand({
      TopicArn,
      Protocol,
      Endpoint: `${Protocol === PROTOCOLS.SMS ? "+57" : ""}${endpoint}`,
    })
  );
};

exports.unsubscribeEndpoint = async (SubscriptionArn) => {
  return await client.send(
    new UnsubscribeCommand({
      SubscriptionArn,
    })
  );
};

exports.listSubscriptionByParams = async (params) => {
  const subs = [];
  let NextToken;
  let temp;
  do {
    temp = await client.send(
      new ListSubscriptionsCommand({
        NextToken,
      })
    );
    subs.push(...temp.Subscriptions);
    NextToken = temp.NextToken;
  } while (NextToken);
  return subs.filter((sub) =>
    params.reduce(
      (acc, param) => acc || sub.Endpoint.indexOf(param) >= 0,
      false
    )
  );
};

exports.publishNotification = async (PublishBatchRequestEntries, TopicArn) => {
  return await client.send(
    new PublishBatchCommand({ PublishBatchRequestEntries, TopicArn })
  );
};
