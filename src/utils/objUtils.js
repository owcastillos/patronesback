const RADIUS = 6371000;

const calculateAngle = (alpha, beta) => {
  const sinA = Math.sin(alpha);
  const sinB = Math.sin(beta);
  const cosA = Math.cos(alpha);
  const cosB = Math.cos(beta);
  const X = Math.pow(cosB * cosA - 1, 2);
  const Y = Math.pow(cosB * sinA, 2);
  const Z = Math.pow(sinB, 2);
  const D = Math.sqrt(X + Y + Z);
  return 2 * Math.asin(D / 2);
};

exports.calculateDistance = (p0, p1) => {
  const alpha = ((p0.lat - p1.lat) * Math.PI) / 180;
  const beta = ((p0.lon - p1.lon) * Math.PI) / 180;
  return Math.round(RADIUS * calculateAngle(alpha, beta));
};

exports.resources = Object.freeze({
  ADD_CLIENT: "/addclient",
  UPDATE_CLIENT: "/updateclient",
  QUERY_CLIENT_KEY: "/queryclientkey",
  QUERY_CLIENT_PARAMS: "/queryclientparams",
  QUERY_PRODUCT_PARAMS: "/queryproductparams",
  BATCH_PROCESS: "/batch_process",
  QUERY_SUPPLIERS: "/querysuppliers",
  ADD_FILES: "/addfiles/:filesource/:suppliername",
  ADD_CELLPHONE: "/addcellphone",
  VERIFY_CELLPHONE: "/verifycellphone",
  UPDATE_PREFERENCES: "/updatepreferences",
});
