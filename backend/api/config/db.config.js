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
    DB_DIALECT,
  } = require("./env"),
  { logger } = require("./logger.config.js");

/**
 * Sequelize database connection instance.
 *
 * @constant
 * @type {Sequelize}
 *
 * @property {string} host - The database host.
 * @property {string} username - The database username.
 * @property {string} password - The database password.
 * @property {number} port - The database port.
 * @property {string} database - The name of the database.
 * @property {string} dialect - The SQL dialect to use (e.g., 'mysql', 'postgres').
 * @property {function} logging - A logging function that logs Sequelize queries.
 */
const db = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
  dialect: DB_DIALECT,
  logging: (message) => {
    logger.info(message);
  },
});

/**
 * Authenticate the database connection using Sequelize's `db.authenticate()` method.
 *
 * @function
 * @returns {Promise} A Promise that resolves if the database connection is established successfully or rejects with an error if there is a connection issue.
 * @throws {Error} If there is an error during the database authentication process.
 */
db.authenticate()
  .then(() => {
    logger.info("The database connection has been successfully established!");
  })
  .catch((error) => {
    logger.error("Encountered issues connecting to the database.", error);
  });

module.exports = { db };
