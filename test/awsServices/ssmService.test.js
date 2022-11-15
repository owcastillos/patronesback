const { expect } = require("chai");
const { mockClient } = require("aws-sdk-client-mock");
const {
  SSMClient,
  GetParametersByPathCommand,
} = require("@aws-sdk/client-ssm");
const client = mockClient(SSMClient);
const service = require("../../src/awsservices/ssmService");
describe("ssmService test", () => {
  beforeEach(() => {
    client.reset();
  });
  it("getParameters", async () => {
    client
      .on(GetParametersByPathCommand)
      .resolvesOnce({
        Parameters: [{ Name: "name0", Value: "value0" }],
        NextToken: "nextToken",
      })
      .resolves({
        Parameters: [{ Name: "name1", Value: "value1" }],
      });
    const rs = await service.getParameters("any");
    expect(rs.name0).equal("value0");
    expect(rs.name1).equal("value1");
  });
});
