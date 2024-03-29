const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_DIALECT: process.env.DB_DIALECT,
  ALTER_DB: process.env.ALTER_DB,
  TIME_FORMAT: process.env.TIME_FORMAT,
  MAX_SIZE: process.env.MAX_SIZE,
  LOG_LEVEL: process.env.LOG_LEVEL,
  FILE_NAME: process.env.FILE_NAME,
  FOLDER_NAME: process.env.FOLDER_NAME,
  CATEGORY: process.env.CATEGORY,
  ALGORITHM: process.env.ALGORITHM,
  TOKEN_EXPIRES_TIME: process.env.TOKEN_EXPIRES_TIME,
  SEPOLIA_JSON_RPC_URL: process.env.SEPOLIA_JSON_RPC_URL,
  SEPOLIA_ESCROWFACTORY_ADDRESS: process.env.SEPOLIA_ESCROWFACTORY_ADDRESS,
  SHASTA_JSON_RPC_URL: process.env.SHASTA_JSON_RPC_URL,
  MAINNET_JSON_RPC_URL: process.env.MAINNET_JSON_RPC_URL,
  NILE_JSON_RPC_URL: process.env.NILE_JSON_RPC_URL,
  NILE_EVENT_SERVER: process.env.NILE_EVENT_SERVER,
  TRON_CONTRACT_ADDRESS: process.env.TRON_CONTRACT_ADDRESS,
  SOLANA_PROGRAM_ID: process.env.SOLANA_PROGRAM_ID,
  SOL_DEVNET_JSONRPC: process.env.SOL_DEVNET_JSONRPC,
  CONTRACT_ADDRESS1: process.env.CONTRACT_ADDRESS1,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  LOGGER_ERROR_PATH: process.env.LOGGER_ERROR_PATH,
  LOGGER_COMBINED_PATH: process.env.LOGGER_COMBINED_PATH,
  DEAL_LINK_PATH: process.env.DEAL_LINK_PATH,
  EUSDT_TOKEN_ADDRESS: process.env.EUSDT_TOKEN_ADDRESS,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
};
