const { v4 } = require("uuid");
const dynamoService = require("../awsservices/dynamoService");
const locationService = require("../awsservices/locationService");
const ssmService = require("../awsservices/ssmService");
const snsService = require("../awsservices/snsService");
const { calculateDistance } = require("../utils/objUtils");
const PATH_PARAMETERS = "/simcf";
const BATCH_SIZE = 25;
const ADD_OPER = "add";
const TOPICS = ["ALIMENTOS", "COCINA", "HOGAR", "PERSONAL", "ROPA"];

let params;

(async () => {
  params = await ssmService.getParameters(PATH_PARAMETERS);
  console.log("PARAMS", params);
})();

exports.addClient = async (body) => {
  const location = await locationService.findLocation(
    params.location_index,
    body.address
  );
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
        if (!snsNotifications[topic]) {
          snsNotifications[topic] = [];
        }
        snsNotifications[topic].push({
          Id: v4(),
          Subject: `Aprovecha la promo en ${supplierName}`,
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
  const snsPromises = Object.entries(snsNotifications).map((entry) =>
    snsService.publishNotification(entry[1], `${params.sns_prefix}${entry[0]}`)
  );
  return await Promise.all([...dynamoPromises, ...snsPromises]).then(
    () => true
  );
};

exports.addPhoneNumber = async (cellphone) => {
  return await snsService.addPhoneNumber(cellphone);
};

exports.verifyPhoneNumber = async (cellphone, otp) => {
  return await snsService.verifyPhoneNumber(cellphone, otp);
};

exports.updateSNSPreferences = async (client) => {
  const subs = await snsService.listSubscriptionByParams([
    client.email,
    client.cellphone,
  ]);
  const promises = [];
  let subsTopic;
  TOPICS.forEach((topic) => {
    subsTopic = subs.filter((sub) => sub.TopicArn.indexOf(topic) >= 0);
    if (client.categories.indexOf(topic) >= 0) {
      if (subsTopic.length == 0) {
        promises.push(
          snsService.subscribeEndpoint(
            `${params.sns_prefix}${topic}`,
            snsService.PROTOCOLS.SMS,
            client.cellphone
          ),
          snsService.subscribeEndpoint(
            `${params.sns_prefix}${topic}`,
            snsService.PROTOCOLS.EMAIL,
            client.email
          )
        );
      }
    } else {
      subsTopic.forEach((subsT) => {
        if (subsT.SubscriptionArn) {
          promises.push(snsService.unsubscribeEndpoint(subsT.SubscriptionArn));
        }
      });
    }
  });
  return await Promise.all(promises);
};
