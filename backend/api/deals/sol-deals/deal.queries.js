const { Op } = require("sequelize");
const { DEAL_LINK_PATH } = require("../../config/env");
const { SolDeal } = require("./deal.model");

const DealTable = (function () {
  /**
   * @description Creates a new deal in the database.
   * @param {Object} dealDetails deal's information
   * @returns {Object}
   */
  const add = async (dealDetails) => {
    const newuuid =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const queryResult = await SolDeal.create({
      id: newuuid,
      deal_link: `${DEAL_LINK_PATH}${newuuid}`,
      ...dealDetails,
    });
    return queryResult;
  };

  /**
   * @description fetches a particular against a particular deal id.
   * @param {String} deal_id
   * @returns {Object | Boolean}
   */
  const getDealById = async (deal_id) => {
    const queryResult = await SolDeal.findAndCountAll({
      where: { id: deal_id },
      attributes: {
        exclude: ["updatedAt", "deleted_at"],
      },
    });
    return queryResult ? queryResult : false;
  };

  /**
   * @description fetches all available deals against a particular wallet address.
   * @param {String} wallet_address
   * @param {Number} offset
   * @param {Number} limit
   * @returns {Object | Boolean}
   */
  const getDealsByWalletAddress = async (
    columnName,
    val,
    offset = 0,
    limit = 10
  ) => {
    const queryResult = await SolDeal.findAndCountAll({
      where: {
        [columnName]: val,
      },
      offset,
      limit,
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["updatedAt", "deleted_at"],
      },
    });
    return queryResult.rows.length != 0 ? queryResult : false;
  };

  /**
   * @description sets the escrow wallet and commission rate for a particular deal.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const setEscrowWalletAndAccountId = async (dealDetails) => {
    const queryResult = await SolDeal.update(
      {
        escrow_wallet: dealDetails.escrowWallet,
        commission_rate: dealDetails.commissionRate,
        min_escrow_amount: dealDetails.minimumEscrowAmount,
      },
      { where: { id: dealDetails.deal_id } }
    );
    return queryResult;
  };

  /**
   * @description updates deal status to funded.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const updateStatusToFunded = async (dealDetails) => {
    const queryResult = await SolDeal.update(
      {
        buyer_wallet: dealDetails.buyerWallet,
        deal_status: dealDetails.dealStatus,
      },
      { where: { id: dealDetails.deal_id } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to accepted and subsequently sets the seller.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const updateStatusToAccepted = async (dealDetails) => {
    const queryResult = await SolDeal.update(
      {
        seller_wallet: dealDetails.seller,
        deal_status: dealDetails.dealStatus,
        isDealLinkActive: false,
      },
      { where: { id: dealDetails.deal_id } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to released and subsequently sets the necessary fields.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const updateStatusToReleased = async (dealDetails) => {
    const queryResult = await SolDeal.update(
      {
        released_by: dealDetails.releasedBy,
        released_amount: dealDetails.amountReleased,
        commission_amount: dealDetails.commissionAmount,
        deal_status: dealDetails.dealStatus,
      },
      { where: { id: dealDetails.deal_id } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to refunded and subsequently sets the necessary fields.
   * @param {Object} dealDetails
   * @returns
   */
  const updateStatusToRefunded = async (dealDetails) => {
    const queryResult = await SolDeal.update(
      {
        released_by: dealDetails.buyer,
        released_amount: dealDetails.amount_withdrawn,
        commission_amount: dealDetails.commission_amount,
        deal_status: dealDetails.dealStatus,
        isDealLinkActive: false,
      },
      { where: { id: dealDetails.deal_id } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to owner withdrew and subsequently sets the necessary fields.
   * @param {Object} dealDetails
   * @returns
   */
  const updateStatusToOwnerWithdraw = async (dealDetails) => {
    const queryResult = await SolDeal.update(
      {
        released_by: dealDetails._destAddr,
        released_amount: dealDetails.amount_withdrawn,
        commission_amount: dealDetails.amount_withdrawn,
        deal_status: dealDetails.dealStatus,
        isDealLinkActive: false,
      },
      { where: { id: dealDetails.deal_id } }
    );
    return queryResult;
  };

  /**
   * @description Searches for the given string amongst particular fields.
   * @param {String} searchString
   * @param {Number} offset
   * @param {Number} limit
   * @returns {Object}
   */
  const searchInfo = async (
    columnName,
    val,
    searchString,
    offset = 0,
    limit = 10
  ) => {
    const queryResult = await SolDeal.findAndCountAll({
      raw: true,
      where: {
        [columnName]: val,
        [Op.or]: [
          {
            id: {
              [Op.like]: `%${searchString}%`,
            },
          },
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
        ],
      },
      limit,
      offset,
      order: [["updatedAt", "DESC"]],
      attributes: { exclude: ["updatedAt", "deleted_at"] },
    });
    return queryResult;
  };

  const checkDealLinkStatus = async (dealDetails) => {
    const queryResult = await SolDeal.findOne({
      where: { id: dealDetails.deal_id },
    });
    return queryResult.getDataValue("isDealLinkActive");
  };

  return {
    add,
    getDealById,
    getDealsByWalletAddress,
    setEscrowWalletAndAccountId,
    updateStatusToFunded,
    updateStatusToAccepted,
    updateStatusToReleased,
    updateStatusToRefunded,
    updateStatusToOwnerWithdraw,
    searchInfo,
    checkDealLinkStatus,
  };
})();

module.exports = {
  DealTable,
};
