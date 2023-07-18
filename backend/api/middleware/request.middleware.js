const { HelperFunction } = require("../common/helpers"),
  { ConstantMembers } = require("../common/members"),
  url = require("node:url");

const requestMiddleware = function () {
  /**
   * @description Validates incoming data against pre-defined schema.
   * @param {Joi.Schema} schema schema to validate the incoming data against.
   * @param {Object} data data to be validated.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  const validate = async (schema, data, req, res, next) => {
    const { error } = schema.validate(data);
    if (error) {
      const response = HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.BAD_REQUEST,
        ConstantMembers.STATUS.FALSE,
        error.message
      );
      return res.status(response.code).json(response);
    }
    next();
  };

  /**
   * @description Validates the incoming Request Body.
   * @param {Joi.Schema} reqSchema
   * @returns
   */
  const validateReqBody = function (reqSchema) {
    return async (req, res, next) => {
      if (req.body) {
        await validate(reqSchema, req.body, req, res, next);
      } else {
        response = HelperFunction.createResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          false,
          ConstantMembers.Messages.request.validationError["required-req-body"]
        );
        res.status(response.code).json(response);
      }
    };
  };

  /**
   * @description Validates the incoming Query Params.
   * @param {Joi.Schema} reqSchema
   * @returns
   */
  const validateQueryParam = function (queryParamSchema) {
    return async (req, res, next) => {
      const urlInfo = url.parse(req.url);
      if (req.query) {
        await validate(queryParamSchema, req.query, req, res, next);
      } else if (
        req.query.page_num &&
        req.query.record_limit &&
        urlInfo.pathname == "/search"
      ) {
        await validate(queryParamSchema, req.query, req, res, next);
      } else {
        response = HelperFunction.createResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          false,
          ConstantMembers.Messages.request.validationError[
            "required-query-params"
          ]
        );
        res.status(response.code).json(response);
      }
    };
  };

  /**
   * @description Validates the incoming Path Parameters.
   * @param {Joi.Schema} pathParamSchema
   * @returns
   */
  const validatePathParam = function (pathParamSchema) {
    return async (req, res, next) => {
      if (req.params) {
        await validate(pathParamSchema, req.params, req, res, next);
      } else {
        const response = HelperFunction.createResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          false,
          ConstantMembers.Messages.request.validationError[
            "required-path-params"
          ]
        );
        res.status(response.code).json(response);
      }
    };
  };

  return {
    validateReqBody,
    validateQueryParam,
    validatePathParam,
  };
};

module.exports = {
  reqMiddleware: requestMiddleware(),
};
