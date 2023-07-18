/**
 * Logger configurations
 */
const winston = require("winston"),
  {
    TIME_FORMAT,
    MAX_SIZE,
    LOG_LEVEL,
    FILE_NAME,
    LOGGER_ERROR_PATH,
    LOGGER_COMBINED_PATH,
    CATEGORY,
  } = require("./env");
require("winston-daily-rotate-file");

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.label({ label: CATEGORY }),
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: FILE_NAME,
      dirname: process.cwd() + `${LOGGER_ERROR_PATH}`,
      level: "error",
      datePattern: TIME_FORMAT,
      maxSize: MAX_SIZE,
    }),
    new winston.transports.DailyRotateFile({
      filename: FILE_NAME,
      dirname: process.cwd() + `${LOGGER_COMBINED_PATH}`,
      datePattern: TIME_FORMAT,
      maxSize: MAX_SIZE,
    }),
  ],
});

if (process.env.NODE_ENV.trim() !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    })
  );
}

module.exports = {
  logger,
};
