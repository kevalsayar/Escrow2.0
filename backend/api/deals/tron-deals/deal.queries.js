const { Op } = require("sequelize"),
  { v4 } = require("uuid"),
  { DEAL_LINK_PATH } = require("../../config/env"),
  { TronDealsModel } = require("./deal.model"),
  { HelperFunction } = require("../../common/helpers");

const TronQueries = (() => {
  /**
   * @description Add a new deal to the database using a transaction.
   * @param {Object} dealDetails - The details of the deal to be added.
   * @returns {Promise<Object>} A Promise that resolves to the newly created deal.
   * @throws {Error} If there's an issue creating the deal.
   */
  const add = async (dealDetails) =>
    await HelperFunction.runTransaction(async (transaction) => {
      const newuuid = v4();
      return await TronDealsModel.create(
        {
          id: newuuid,
          deal_link: `${DEAL_LINK_PATH}${newuuid}`,
          ...dealDetails,
        },
        { transaction: transaction }
      );
    });

  /**
   * @description  Retrieve a deal by its unique identifier.
   * @param {string} id - The unique identifier of the deal to retrieve.
   * @returns {Promise<Object | null>} A Promise that resolves to the retrieved deal object, or null if not found.
   * @throws {Error} If there's an issue retrieving the deal.
   */
  const getDealById = async (id) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await TronDealsModel.findOne({
          where: { id },
          attributes: {
            exclude: ["commission_wallet", "updatedAt", "deleted_at"],
          },
          transaction,
        })
    );

  /**
   * @description Retrieve a list of deals by a specific column value, optionally paginated.
   * @param {string} col - The name of the column to search by.
   * @param {string} val - The value to search for in the specified column.
   * @param {number} [offset=0] - The number of records to skip before starting to return records (pagination).
   * @param {number} [limit=10] - The maximum number of records to return (pagination).
   * @returns {Promise<{ rows: Object[], count: number }>} A Promise that resolves to an object containing an array of retrieved deals (rows) and the total count of matching deals (count).
   * @throws {Error} If there's an issue retrieving the deals.
   */
  const getDealsByWalletAddress = async (col, val, offset = 0, limit = 10) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await TronDealsModel.findAndCountAll({
          where: {
            [col]: val,
          },
          offset,
          limit,
          order: [["updatedAt", "DESC"]],
          attributes: {
            exclude: ["commission_wallet", "updatedAt", "deleted_at"],
          },
          transaction,
        })
    );

  /**
   * @description Asynchronously updates deal details based on a given query object, using a transaction.
   * @param {Object} detailsToUpdate - The details to be updated.
   * @param {Object} whereQueryObj - The query object specifying which deals to update.
   * @returns {Promise<number>} A promise that resolves with the number of updated deals.
   * @throws {Error} If there is an error during the transaction or update operation.
   */
  const updateDealDetails = async (detailsToUpdate, whereQueryObj) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await TronDealsModel.update(
          detailsToUpdate,
          { where: whereQueryObj },
          transaction
        )
    );

  /**
   * @description Search for deals based on specified criteria and search string, optionally paginated.x
   * @param {string} col - The name of the column to filter by.
   * @param {string} val - The value to filter for in the specified column.
   * @param {string} searchString - The search string to match against deal information.
   * @param {number} [offset=0] - The number of records to skip before starting to return records (pagination).
   * @param {number} [limit=10] - The maximum number of records to return (pagination).
   * @returns {Promise<{ rows: Object[], count: number }>} A Promise that resolves to an object containing an array of retrieved deals (rows) and the total count of matching deals (count).
   * @throws {Error} If there's an issue searching for deals.
   */
  const searchInfo = async (col, val, searchString, offset = 0, limit = 10) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await TronDealsModel.findAndCountAll({
          raw: true,
          where: {
            [col]: val,
            [Op.or]: [
              {
                deal_title: {
                  [Op.like]: `%${searchString}%`,
                },
              },
              {
                deal_description: {
                  [Op.like]: `%${searchString}%`,
                },
              },
              {
                buyer_wallet: {
                  [Op.like]: `%${searchString}%`,
                },
              },
              {
                seller_wallet: {
                  [Op.like]: `%${searchString}%`,
                },
              },
              {
                fund_tx_hash: {
                  [Op.like]: `%${searchString}%`,
                },
              },
              {
                release_tx_hash: {
                  [Op.like]: `%${searchString}%`,
                },
              },
            ],
          },
          limit,
          offset,
          order: [["updatedAt", "DESC"]],
          attributes: { exclude: ["updatedAt", "deleted_at"] },
          transaction,
        })
    );

  return {
    add,
    getDealById,
    getDealsByWalletAddress,
    searchInfo,
    updateDealDetails,
  };
})();

module.exports = {
  TronQueries,
};
