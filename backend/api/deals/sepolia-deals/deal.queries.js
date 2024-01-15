const { Op } = require("sequelize"),
  { v4 } = require("uuid"),
  { HelperFunction } = require("../../common/helpers"),
  { DEAL_LINK_PATH } = require("../../config/env"),
  { SepoliaDealsModel } = require("./deal.model");

const SepoliaQueries = (() => {
  /**
   * @description Asynchronously adds a new deal using a transaction.
   * @param {Object} dealDetails - The details of the deal to be added.
   * @returns {Promise<any>} A promise that resolves when the deal has been added.
   * @throws {Error} If there is an error during the transaction or deal creation.
   */
  const add = async (dealDetails) =>
    await HelperFunction.runTransaction(async (transaction) => {
      const newuuid = v4();
      return await SepoliaDealsModel.create(
        {
          id: newuuid,
          deal_link: `${DEAL_LINK_PATH}${newuuid}`,
          ...dealDetails,
        },
        { transaction: transaction }
      );
    });

  /**
   * @description Asynchronously retrieves a deal by its unique identifier using a transaction.
   * @param {string} id - The unique identifier of the deal to retrieve.
   * @returns {Promise<any>} A promise that resolves with the retrieved deal or null if not found.
   * @throws {Error} If there is an error during the transaction or query execution.
   */
  const getDealById = async (id) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await SepoliaDealsModel.findOne({
          where: { id },
          attributes: {
            exclude: ["commission_wallet", "updatedAt", "deleted_at"],
          },
          transaction,
        })
    );

  /**
   * @description Retrieves a list of SepoliaDeals based on specified column, value, offset, limit, and an optional search string.
   * @param {string} col - The column to filter by (e.g., 'buyer_wallet').
   * @param {string} val - The value to match in the specified column.
   * @param {number} [offset=0] - The number of records to skip in the result set (pagination).
   * @param {number} [limit=10] - The maximum number of records to retrieve (pagination).
   * @param {string} [searchVal=""] - An optional search string to filter deals by title, description, buyer_wallet, seller_wallet, fund_tx_hash, or release_tx_hash.
   * @returns {Promise<{ count: number, rows: SepoliaDealsModel[] }>} A promise that resolves to an object containing the count of matching records and an array of SepoliaDealsModel instances.
   */
  const getDeals = async (
    col,
    val,
    offset = 0,
    limit = null,
    searchVal = ""
  ) => {
    return await HelperFunction.runTransaction(async (transaction) => {
      const whereClause = {
        [col]: val,
      };

      if (searchVal)
        whereClause[Op.or] = [
          { deal_title: { [Op.like]: `%${searchVal}%` } },
          { deal_description: { [Op.like]: `%${searchVal}%` } },
          { buyer_wallet: { [Op.like]: `%${searchVal}%` } },
          { seller_wallet: { [Op.like]: `%${searchVal}%` } },
          { fund_tx_hash: { [Op.like]: `%${searchVal}%` } },
          { release_tx_hash: { [Op.like]: `%${searchVal}%` } },
        ];

      return await SepoliaDealsModel.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [["updatedAt", "DESC"]],
        attributes: { exclude: ["updatedAt", "deleted_at"] },
        transaction,
      });
    });
  };

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
        await SepoliaDealsModel.update(
          detailsToUpdate,
          { where: whereQueryObj },
          transaction
        )
    );

  return {
    add,
    getDealById,
    getDeals,
    updateDealDetails,
  };
})();

module.exports = { SepoliaQueries };
