const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require("os");
const multer = require("multer");
const fs = require("fs");
const services = require("./businessServices/services");
const { resources } = require("./utils/objUtils");
const app = express();
const upload = multer({ dest: os.tmpdir() });
const PORT = 3000;

app
  .use(
    cors([
      {
        origin: "*",
      },
    ])
  )
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json());

app.post(resources.ADD_CLIENT, (req, res) => {
  services.addClient(req.body).then(() => {
    res.statusCode = 201;
    res.json({ result: true });
  });
});
app.post(resources.UPDATE_CLIENT, (req, res) => {
  services.updateClient(req.body).then(() => {
    res.statusCode = 200;
    res.json({ result: true });
  });
});
app.post(resources.QUERY_CLIENT_KEY, (req, res) => {
  services.getClient(req.body).then((rsService) => {
    res.statusCode = rsService.Item ? 200 : 404;
    res.json(rsService.Item);
  });
});
app.post(resources.QUERY_PRODUCT_PARAMS, (req, res) => {
  services.getProducts(req.body).then((rsService) => {
    res.statusCode = 200;
    res.json(rsService.Items);
  });
});
app.post(resources.QUERY_SUPPLIERS, (req, res) => {
  services.getSuppliers(req.body).then((rsService) => {
    res.statusCode = 200;
    res.json(rsService);
  });
});
app.post(resources.ADD_FILES, upload.single("file"), (req, res) => {
  const file = req.file;
  const data = fs.readFileSync(file.path).toString("utf8");
  services
    .processContent(
      req.params.filesource,
      decodeURIComponent(req.params.suppliername),
      data
    )
    .then(() => {
      res.statusCode = 201;
      res.json({ result: true });
    });
});
app.post(resources.ADD_CELLPHONE, (req, res) => {
  services.addPhoneNumber(req.body.cellphone).then(() => {
    res.statusCode = 201;
    res.json({ result: true });
  });
});
app.post(resources.VERIFY_CELLPHONE, (req, res) => {
  const { cellphone, otp } = req.body;
  services.verifyPhoneNumber(cellphone, otp).then(() => {
    res.statusCode = 200;
    res.json({ result: true });
  });
});
app.post(resources.UPDATE_PREFERENCES, (req, res) => {
  services.updateSNSPreferences(req.body).then(() => {
    res.statusCode = 200;
    res.json({ result: true });
  });
});
app.get(resources.HEALTH_CHECK, (req, res) => {
  res.send({ status: "Funciona!" });
});

const server = http.createServer(app);
server.listen(PORT);
console.debug("Server listening on port " + PORT);
