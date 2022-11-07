const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  BatchWriteCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const OPERATION = { add: "PutRequest", delete: "DeleteRequest" };
const OPERATION_ELEMENT = { add: "Item", delete: "Key" };

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

const transformItems = (TableName, Items) => {
  return {
    RequestItems: {
      [TableName]: Items.map((element) => {
        const { operation, ...item } = element;
        return {
          [OPERATION[operation]]: {
            [OPERATION_ELEMENT[operation]]: item,
          },
        };
      }),
    },
  };
};

const expressionItems = (Item) => {
  const KeyConditionExpression = [];
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  Object.keys(Item).forEach((keyItem) => {
    KeyConditionExpression.push(`#${keyItem} = :item${keyItem}`);
    ExpressionAttributeNames[`#${keyItem}`] = keyItem;
    ExpressionAttributeValues[`:item${keyItem}`] = Item[keyItem];
  });
  return {
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};

exports.putItem = async (TableName, Item) => {
  return await client.send(new PutCommand({ TableName, Item }));
};

exports.batchItems = async (TableName, Items) => {
  const commandInput = transformItems(TableName, Items);
  return await client.send(new BatchWriteCommand(commandInput));
};

exports.getItem = async (TableName, Key) => {
  return await client.send(new GetCommand({ TableName, Key }));
};

exports.queryItems = async (TableName, Item) => {
  const expressions = expressionItems(Item);
  return await client.send(
    new QueryCommand({
      TableName,
      ...expressions,
    })
  );
};

exports.updateItem = async (TableName, Key, Item) => {
  const { KeyConditionExpression, ...expressions } = expressionItems(Item);
  return await client.send(
    new UpdateCommand({
      TableName,
      Key,
      UpdateExpression: `set ${KeyConditionExpression.join(", ")}`,
      ...expressions,
    })
  );
};

exports.deleteItem = async (TableName, Key) => {
  return await client.send(new DeleteCommand({ TableName, Key }));
};
