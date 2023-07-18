/**
 * DB configurations
 */
const { Sequelize } = require("sequelize"),
  {
    DB_HOST,
    DB_USERNAME,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DIALECT,
  } = require("./env"),
  { logger } = require("./logger.config.js");

const db = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
  dialect: DIALECT,
  logging: (message) => {
    logger.info(message);
  },
});

db.authenticate()
  .then(() => {
    logger.info("Database Connection's been established successfully!");
  })
  .catch((error) => {
    logger.error("Unable to connect to the database!");
  });

module.exports = {
  db,
};
