const { v4 } = require("uuid");
const dynamoService = require("../awsservices/dynamoService");
const locationService = require("../awsservices/locationService");
const ssmService = require("../awsservices/ssmService");
const { calculateDistance } = require("../utils/objUtils");
const PATH_PARAMETERS = "/simcf";
const BATCH_SIZE = 50;
const ADD_OPER = "add";

let params;

await (async () => {
  params = await ssmService.getParameters(PATH_PARAMETERS);
})();

exports.addClient = async (body) => {
  const location = await locationService.findLocation(body.address);
  return await dynamoService.putItem(params.table_clients, {
    ...body,
    location,
  });
};

exports.updateClient = async (body) => {
  const { email, ...client } = body;
  return await dynamoService.updateItem(
    params.table_clients,
    { email },
    client
  );
};

exports.getClient = async (body) => {
  return await dynamoService.getItem(params.table_clients, body);
};

exports.getProducts = async (body) => {
  return await dynamoService.scanItems(params.table_products, body);
};

exports.batchProcess = async (body) => {
  return await dynamoService.batchWriteItems(params.table_products, body);
};

exports.getSuppliers = async (body) => {
  const suppliers = await dynamoService.scanItemsByExpression(
    params.table_clients,
    {
      FilterExpression: "attribute_exists(supplier)",
    }
  );
  return suppliers.Items.map((supp) => {
    const { name, address, supplier, location } = supp;
    const distance = calculateDistance(location, body.location);
    return { name, address, supplier, distance };
  });
};

exports.processContent = async (supplierId, supplierName, body) => {
  const content = body.split("\n");
  let batch = [];
  const dynamoPromises = [];
  const snsNotifications = {};
  content.forEach((line) => {
    if (batch.length === BATCH_SIZE) {
      dynamoPromises.push(
        dynamoService.batchWriteItems(params.table_products, batch)
      );
      batch = [];
    }
    const fields = line.split(",");
    const operation = fields[1].toLowerCase();
    let itemSIM = {
      idproduct: `${supplierId}${fields[0]}`,
      operation,
    };
    if (operation === ADD_OPER) {
      itemSIM = {
        ...itemSIM,
        name: fields[2].toUpperCase(),
        category: fields[3].toUpperCase(),
        supplier: supplierId,
        price: Number(fields[4]),
        unit: fields[5].toLowerCase(),
        promo: JSON.parse(fields[6].toLowerCase()),
      };
      if (itemSIM.promo) {
        const topic = itemSIM.category;
        if (snsNotifications[topic]) {
          snsNotifications[topic] = [];
        }
        snsNotifications[topic].push({
          Id: v4(),
          Subject: "Aprovecha la promo",
          Message: `Promo: ${itemSIM.name} $${itemSIM.price}/${itemSIM.unit} en ${supplierName}`,
        });
      }
    }
    batch.push(itemSIM);
  });
  if (batch.length > 0) {
    dynamoPromises.push(
      dynamoService.batchWriteItems(params.table_products, batch)
    );
  }
  const snsPromises = Object.entries(snsNotifications).map((entry) => ({
    TopicArn: `${params.sns_prefix}${entry[0]}`,
    PublishBatchRequestEntries: entry[1],
  }));
  return await Promise.all([...dynamoPromises, ...snsPromises]).then(
    () => true
  );
};
