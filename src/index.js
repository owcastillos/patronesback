const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const os = require("os");
const multer = require("multer");
const fs = require("fs");
const businessService = require("./services/businessService");
const { resources } = require("./utils/objUtils");
const { sendLog } = require("./services/logService");
const app = express();
const upload = multer({ dest: os.tmpdir() });
const PORT = 3000;

app
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, content-type"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  })
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .post(resources.ADD_CLIENT, (req, res) => {
    businessService.addClient(req.body).then(() => {
      sendLog(`${resources.ADD_CLIENT} successfully`);
      res.statusCode = 201;
      res.json({ result: true });
    });
  })
  .post(resources.UPDATE_CLIENT, (req, res) => {
    businessService.updateClient(req.body).then(() => {
      sendLog(`${resources.UPDATE_CLIENT} successfully`);
      res.statusCode = 200;
      res.json({ result: true });
    });
  })
  .post(resources.QUERY_CLIENT_KEY, (req, res) => {
    businessService.getClient(req.body).then((rsService) => {
      sendLog(`${resources.QUERY_CLIENT_KEY} successfully`);
      res.statusCode = rsService.Item ? 200 : 404;
      res.json(rsService.Item);
    });
  })
  .post(resources.QUERY_PRODUCT_PARAMS, (req, res) => {
    businessService.getProducts(req.body).then((rsService) => {
      sendLog(`${resources.QUERY_PRODUCT_PARAMS} successfully`);
      res.statusCode = 200;
      res.json(rsService.Items);
    });
  })
  .post(resources.QUERY_SUPPLIERS, (req, res) => {
    businessService.getSuppliers(req.body).then((rsService) => {
      sendLog(`${resources.QUERY_SUPPLIERS} successfully`);
      res.statusCode = 200;
      res.json(rsService);
    });
  })
  .post(resources.ADD_FILES, upload.single("file"), (req, res) => {
    const file = req.file;
    const data = fs.readFileSync(file.path).toString("utf8");
    businessService
      .processContent(
        req.params.filesource,
        decodeURIComponent(req.params.suppliername),
        data
      )
      .then(() => {
        sendLog(`${resources.ADD_FILES} successfully`);
        res.statusCode = 201;
        res.json({ result: true });
      });
  })
  .post(resources.ADD_CELLPHONE, (req, res) => {
    businessService.addPhoneNumber(req.body.cellphone).then(() => {
      sendLog(`${resources.ADD_CELLPHONE} successfully`);
      res.statusCode = 201;
      res.json({ result: true });
    });
  })
  .post(resources.VERIFY_CELLPHONE, (req, res) => {
    const { cellphone, otp } = req.body;
    businessService.verifyPhoneNumber(cellphone, otp).then(() => {
      sendLog(`${resources.VERIFY_CELLPHONE} successfully`);
      res.statusCode = 200;
      res.json({ result: true });
    });
  })
  .post(resources.UPDATE_PREFERENCES, (req, res) => {
    businessService.updateSNSPreferences(req.body).then(() => {
      sendLog(`${resources.UPDATE_PREFERENCES} successfully`);
      res.statusCode = 200;
      res.json({ result: true });
    });
  })
  .get(resources.HEALTH_CHECK, (req, res) => {
    sendLog(`${resources.HEALTH_CHECK} successfully`);
    res.send({ status: "OK" });
  });

const server = http.createServer(app);
server.listen(PORT);
console.debug("Server listening on port " + PORT);
