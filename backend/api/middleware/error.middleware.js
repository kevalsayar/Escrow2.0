const { ConstantMembers } = require("../common/members");

/**
 * @description Express middleware for handling errors and generating appropriate error responses.
 * @param {Error} err - The error object.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 * @returns {express.Response} The HTTP response with error details.
 */
const errorHandler = (err, req, res, next) => {
  const response = {
    code: err.code
      ? err.code
      : ConstantMembers.STATUS_CODE.INTERNAL_SERVER_ERROR,
    status: err.status ? err.status : ConstantMembers.API_STATUS.FALSE,
    message:
      process.env.NODE_ENV.trim() === "dev"
        ? err.message
        : ConstantMembers.SERVER_MESSAGES.request.error.internal,
  };

  res.status(response.code).json(response);
};

module.exports = {
  errorHandler,
};
