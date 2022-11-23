const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: "us-east-2",
});

const streamToString = (stream) => {
  return new Promise((res, rej) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", rej);
    stream.on("end", () => res(Buffer.concat(chunks).toString("utf8")));
  });
};

exports.setObject = async (Bucket, Key, Body, ContentType) => {
  return await client.send(
    new PutObjectCommand({ Bucket, Key, Body, ContentType })
  );
};

exports.getObject = async (Bucket, Key) => {
  return await new Promise((res, rej) => {
    client
      .send(new GetObjectCommand({ Bucket, Key }))
      .then((stream) => streamToString(stream))
      .then((data) => res({ Filename: Key, data }))
      .catch(rej);
  });
};
