const express = require("express"),
  bodyParser = require("body-parser"),
  { PORT } = require("././api/config/env"),
  indexRouter = require("./api/index"),
  cors = require("cors"),
  { serve, setup } = require("swagger-ui-express"),
  swaggerDoc = require("./openapi.json"),
  { swaggerOptions } = require("./api/config/swagger.config"),
  { logger } = require("./api/config/logger.config"),
  { ConstantMembers } = require("./api/common/members"),
  { errorHandler } = require("./api/middleware/error.middleware");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

app.use(express.json());

app.get(ConstantMembers.ENDPOINTS.ROOT, function (req, res) {
  res.json({
    project_name: "Escrow v2.0.0",
    description: "Welcome to the Blockchain-based Escrow System's API!",
    APIdocs: `${req.get("host")}${ConstantMembers.ENDPOINTS.APIDOCS}`,
  });
});

app.use(
  ConstantMembers.ENDPOINTS.APIDOCS,
  serve,
  setup(swaggerDoc, swaggerOptions)
);

app.use(ConstantMembers.ENDPOINTS.V1, indexRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server's listening on port ${PORT}.`);
});
