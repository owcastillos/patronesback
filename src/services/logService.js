const http = require("follow-redirects").http;
const child_process = require("child_process");
const host = require("os").hostname;
let hostname;

exports.sendLog = (message) => {
  const data = [
    '{"create": {"_index": "simcf_logs"}}',
    `{"@timestamp": "${new Date().toISOString()}", "pod": "${host}", "message": "${message}"}`,
  ]
    .join("\n")
    .concat("\n");
  const child = child_process.fork("./src/services/logProcess.js");
  child.on("message", (msg) => {
    const { data, content } = msg;
    let req = http.request(
      {
        method: "POST",
        hostname,
        port: 9200,
        path: "/simcf_logs/_bulk",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () =>
          console.log(
            new Date().toISOString(),
            `Message [${content}] sent successfully`
          )
        );
        res.on("error", (error) =>
          console.log(
            new Date().toISOString(),
            `Error when sending [${content}]`
          )
        );
      }
    );
    req.write(data);
    req.end();
  });
  child.send({
    data,
    content:message
  });
};

exports.setURL = (_hostname) => (hostname = _hostname);
