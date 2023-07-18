const {
  ALGORITHM,
  TOKEN_EXPIRES_IN,
  FROM_EMAIL,
  NILE_JSON_RPC_URL,
  NILE_EVENT_SERVER,
} = require("../config/env");

/**
 * JWT Generations Configs
 */
const options = {
  algorithm: ALGORITHM,
  expiresIn: TOKEN_EXPIRES_IN,
};

/**
 * Mail Configs
 */
const mailDetails = {
  from: FROM_EMAIL,
};

/**
 * Swagger Configs
 */
const swaggerOptions = {
  swaggerOptions: { filter: "", persistAuthorization: true },
  customSiteTitle: "User Authentication Swagger",
};

/**
 * Tron Configs
 */
const tronWebObject = {
  fullHost: NILE_JSON_RPC_URL,
  solidityNode: NILE_JSON_RPC_URL,
  eventServer: NILE_EVENT_SERVER,
};

module.exports = {
  options,
  mailDetails,
  swaggerOptions,
  tronWebObject,
};
