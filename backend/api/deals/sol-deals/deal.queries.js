const { Op } = require("sequelize"),
  { DEAL_LINK_PATH } = require("../../config/env"),
  { HelperFunction } = require("../../common/helpers"),
  { SolDealsModel } = require("./deal.model");

const SolQueries = (() => {
  /**
   * @description Adds a new SolDealsModel to the database.
   * @param {object} dealDetails - Details of the SolDealsModel to be added.
   * @returns {Promise<SolDealsModel>} A promise that resolves to the created SolDealsModel instance.
   */
  const add = async (dealDetails) =>
    await HelperFunction.runTransaction(async (transaction) => {
      const newuuid =
        new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

      return await SolDealsModel.create(
        {
          id: newuuid,
          deal_link: `${DEAL_LINK_PATH}${newuuid}`,
          ...dealDetails,
        },
        { transaction: transaction }
      );
    });

  /**
   * @description Fetches a particular deal against a particular id.
   * @param {string} id - The unique identifier of the SolDealsModel to retrieve.
   * @returns {Promise<SolDealsModel|null>} A promise that resolves to the SolDealsModel with the specified ID, or null if not found.
   */
  const getDealById = async (id) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await SolDealsModel.findOne({
          where: { id },
          attributes: {
            exclude: ["updatedAt", "deleted_at"],
          },
          transaction,
        })
    );

  /**
   * @description Retrieves a list of SolDeals based on specified column, value, offset, limit, and an optional search string.
   * @param {string} col - The column to filter by (e.g., 'buyer_wallet').
   * @param {string} val - The value to match in the specified column.
   * @param {number} [offset=0] - The number of records to skip in the result set (pagination).
   * @param {number} [limit=10] - The maximum number of records to retrieve (pagination).
   * @param {string} [searchVal=""] - An optional search string to filter deals by ID, title, description, buyer_wallet, or seller_wallet.
   * @returns {Promise<{ count: number, rows: SolDealsModel[] }>} A promise that resolves to an object containing the count of matching records and an array of SolDealsModel instances.
   */
  const getDeals = async (col, val, offset = 0, limit = 10, searchVal = "") => {
    return await HelperFunction.runTransaction(async (transaction) => {
      const whereClause = {
        [col]: val,
      };

      if (searchVal)
        whereClause[Op.or] = [
          { id: { [Op.like]: `%${searchVal}%` } },
          { deal_title: { [Op.like]: `%${searchVal}%` } },
          { deal_description: { [Op.like]: `%${searchVal}%` } },
          { buyer_wallet: { [Op.like]: `%${searchVal}%` } },
          { seller_wallet: { [Op.like]: `%${searchVal}%` } },
        ];

      return await SolDealsModel.findAndCountAll({
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
   */
  const updateDealDetails = async (detailsToUpdate, whereQueryObj) =>
    await HelperFunction.runTransaction(
      async (transaction) =>
        await SolDealsModel.update(
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

module.exports = { SolQueries };
