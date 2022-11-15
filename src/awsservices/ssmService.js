const {
  SSMClient,
  GetParametersByPathCommand,
} = require("@aws-sdk/client-ssm");

const client = new SSMClient({
  region: "us-east-2",
});

exports.getParameters = async (Path) => {
  let NextToken;
  const parameters = [];
  do {
    const temp = await client.send(
      new GetParametersByPathCommand({
        Path,
        Recursive: true,
        NextToken,
        WithDecryption: true,
      })
    );
    parameters.push(...temp.Parameters);
    NextToken = temp.NextToken;
  } while (NextToken);
  return parameters.reduce(
    (acc, item) =>
      Object.assign(acc, {
        [item.Name.split("/").reverse()[0]]: item.Value,
      }),
    {}
  );
};
