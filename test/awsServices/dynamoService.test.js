const { expect } = require("chai");
const { mockClient } = require("aws-sdk-client-mock");
const {
  DynamoDBDocumentClient,
  PutCommand,
  BatchWriteCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const client = mockClient(DynamoDBDocumentClient);
const dynamoService = require("../../src/awsservices/dynamoService");
describe("dynamoService test", () => {
  beforeEach(() => {
    client.reset();
  });
  it("putItem", async () => {
    client.on(PutCommand).resolves({ Attributes: {} });
    const rs = await dynamoService.putItem("any", {});
    expect(rs.Attributes).not.equal(undefined);
  });
  it("batchWriteItems", async () => {
    client.on(BatchWriteCommand).resolves({ Attributes: {} });
    const itemAdd = {
      email: "any0",
      operation: "add",
    };
    const itemDelete = {
      email: "any1",
      operation: "delete",
    };
    const Items = [...Array(13).fill(itemAdd), ...Array(13).fill(itemDelete)];
    const rs = await dynamoService.batchWriteItems("any", Items);
    expect(rs.Attributes).not.equal(undefined);
  });
  it("getItem", async () => {
    client.on(GetCommand).resolves({ Item: { email: "any" } });
    const rs = await dynamoService.getItem("any", {});
    expect(rs.Item).not.equal(undefined);
  });
  it("scanItems with FieldValues", async () => {
    client.on(ScanCommand).resolves({
      Items: [
        {
          email: "any",
        },
      ],
    });
    const rs = await dynamoService.scanItems("any", {
      FieldsValues: [
        {
          Expressions: [{ Field: "email", Condition: "=", Attribute: "any" }],
          Condition: "and",
        },
      ],
    });
    expect(rs.Items.length).equal(1);
  });
  it("scanItems without FieldValues", async () => {
    client.on(ScanCommand).resolves({
      Items: [
        {
          email: "any",
        },
      ],
    });
    const rs = await dynamoService.scanItems("any", {});
    expect(rs.Items.length).equal(1);
  });
  it("scanItemsByExpression", async () => {
    client.on(ScanCommand).resolves({
      Items: [
        {
          email: "any",
        },
      ],
    });
    const rs = await dynamoService.scanItemsByExpression("any", {});
    expect(rs.Items.length).equal(1);
  });
  it("updateItem", async () => {
    client.on(UpdateCommand).resolves({ Attributes: {} });
    const rs = await dynamoService.updateItem(
      "any",
      { email: "any" },
      { name: "any" }
    );
    expect(rs.Attributes).not.equal(undefined);
  });
  it("deleteItem", async () => {
    client.on(DeleteCommand).resolves({ Attributes: {} });
    const rs = await dynamoService.deleteItem("any", { email: "any" });
    expect(rs.Attributes).not.equal(undefined);
  });
});
