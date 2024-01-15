const { ConstantMembers } = require("../common/members"),
  { ApiError } = require("../utils/ApiError"),
  asyncHandler = require("express-async-handler");

/**
 * Request validation middleware functions.
 */
const reqMiddleware = (() => {
  /**
   * @description Validates incoming data against pre-defined schema.
   * @param {Joi.Schema} schema schema to validate the incoming data against.
   * @param {Object} data data to be validated.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  const validateData = (schema, location) =>
    asyncHandler(async (req, res, next) => {
      const { error } = schema.validate(req[location]);

      if (error)
        throw new ApiError(
          ConstantMembers.STATUS_CODE.BAD_REQUEST,
          error.message
        );

      next();
    });

  return {
    validateData,
  };
})();

module.exports = { reqMiddleware };
