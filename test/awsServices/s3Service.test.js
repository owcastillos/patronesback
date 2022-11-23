const { expect } = require("chai");
const { mockClient } = require("aws-sdk-client-mock");
const { EventEmitter } = require("events");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const client = mockClient(S3Client);
const service = require("../../src/awsservices/s3Service");
describe("s3Service test", () => {
  beforeEach(() => {
    client.reset();
  });
  it("setObject", async () => {
    client.on(PutObjectCommand).resolves({ VersionId: "1" });
    const rs = await service.setObject("any", "any", "any", "any");
    expect(rs.VersionId).equal("1");
  });
  it("getObject", async () => {
    const emitter = () => {
      const e = new EventEmitter();
      setTimeout(() => {
        e.emit("data", Buffer.from('{ "content": "123" }'));
        e.emit("end");
      }, 100);
      return e;
    };
    client.on(GetObjectCommand).resolves(emitter());
    const rs = await service.getObject("any", "any");
    expect(JSON.parse(rs.data).content).equal("123");
  });
});
