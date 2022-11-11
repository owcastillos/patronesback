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
const PORT = 3000;
const CSV_TYPE = "text/csv";

const upload = multer({ dest: os.tmpdir() });

app.use(
  cors([
    {
      origin: "*",
    },
  ])
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(resources.ADD_CLIENT, (req, res) => {
  console.log("Access", req.body);
  services.addClient(req.body).then(() => {
    console.log("Correct", resources.ADD_CLIENT);
    res.statusCode = 201;
    res.json({ result: true });
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());
app.post(resources.UPDATE_CLIENT, (req, res) => {
  console.log("Access", req.body);
  services.updateClient(req.body).then(() => {
    console.log("Correct", resources.UPDATE_CLIENT);
    res.statusCode = 200;
    res.json({ result: true });
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());
app.post(resources.QUERY_CLIENT_KEY, (req, res) => {
  console.log("Access", resources.QUERY_CLIENT_KEY);
  services.getClient(req.body).then((rsService) => {
    console.log("Correct", resources.QUERY_CLIENT_KEY);
    res.statusCode = rsService.Item ? 200 : 404;
    res.json(rsService.Item);
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());
app.post(resources.QUERY_PRODUCT_PARAMS, (req, res) => {
  services.getProducts(req.body).then((rsService) => {
    console.log("Correct", resources.QUERY_PRODUCT_PARAMS);
    res.statusCode = 200;
    res.json(rsService.Items);
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());
app.post(resources.QUERY_SUPPLIERS, (req, res) => {
  services.getSuppliers(req.body).then((rsService) => {
    console.log("Correct", resources.QUERY_SUPPLIERS);
    res.statusCode = 200;
    res.json(rsService);
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());
app.post(resources.ADD_FILES, upload.single("file"), (req, res) => {
  console.log("Access", resources.ADD_FILES);
  const file = req.file;
  const data = fs.readFileSync(file.path).toString("utf8");
  services
    .processContent(
      req.params.filesource,
      decodeURIComponent(req.params.suppliername),
      data
    )
    .then(() => {
      console.log("Correct", resources.ADD_FILES);
      res.statusCode = 201;
      res.json({ result: true });
    });
});
app.post(resources.ADD_CELLPHONE, (req, res) => {
  services.addPhoneNumber(req.body.cellphone).then(() => {
    console.log("Correct", resources.ADD_CELLPHONE);
    res.statusCode = 201;
    res.json({ result: true });
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());
app.post(resources.VERIFY_CELLPHONE, (req, res) => {
  const { cellphone, otp } = req.body;
  services.verifyPhoneNumber(cellphone, otp).then(() => {
    console.log("Correct", resources.VERIFY_CELLPHONE);
    res.statusCode = 200;
    res.json({ result: true });
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());
app.post(resources.UPDATE_PREFERENCES, (req, res) => {
  services.updateSNSPreferences(req.body).then(() => {
    console.log("Correct", resources.UPDATE_PREFERENCES);
    res.statusCode = 200;
    res.json({ result: true });
  });
});
// .use(bodyParser.urlencoded({ extended: false }))
// .use(bodyParser.json());

const server = http.createServer(app);
server.listen(PORT);
console.debug("Server listening on port " + PORT);
