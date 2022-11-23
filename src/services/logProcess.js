process.on("message", (message) => {
  process.send(message);
  process.disconnect();
  process.exit();
});
