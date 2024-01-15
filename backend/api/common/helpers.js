const { db } = require("../config/db.config"),
  { ApiError } = require("../utils/ApiError");

const HelperFunction = (() => {
  /**
   * @description Execute a Sequelize transaction and automatically commit or rollback based on the result of the callback function.
   * @param {Function} transactionCallback The callback function that will be executed within the transaction.
   * @returns {Promise | Boolean} A Promise that resolves when the transaction is successfully committed or rejects if it fails.
   */
  const runTransaction = async (transactionCallback) => {
    const transaction = await db.transaction();

    try {
      const res = await transactionCallback(transaction);

      if (res) await transaction.commit();

      return res;
    } catch (error) {
      await transaction.rollback();

      throw new ApiError(error.code, error.message);
    }
  };

  return {
    runTransaction,
  };
})();

module.exports = { HelperFunction };
