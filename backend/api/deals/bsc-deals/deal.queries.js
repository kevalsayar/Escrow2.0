const { Op, col } = require("sequelize");
const { v4 } = require("uuid");
const { DEAL_LINK_PATH } = require("../../config/env");
const { BscDeal } = require("./deal.model");

const DealTable = (function () {
  /**
   * @description Creates a new deal in the database.
   * @param {Object} dealDetails deal's information
   * @returns {Object}
   */
  const add = async (dealDetails) => {
    const newuuid = v4();
    const queryResult = await BscDeal.create({
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
    const queryResult = await BscDeal.findAndCountAll({
      where: { id: deal_id },
      attributes: {
        exclude: ["commission_wallet", "updatedAt", "deleted_at"],
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
    const queryResult = await BscDeal.findAndCountAll({
      where: {
        [columnName]: val,
      },
      offset,
      limit,
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["commission_wallet", "updatedAt", "deleted_at"],
      },
    });
    return queryResult.rows.length != 0 ? queryResult : false;
  };

  /**
   * @description sets the escrow wallet and commission rate for a particular deal.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const setEscrowWallet = async (dealDetails) => {
    const queryResult = await BscDeal.update(
      {
        escrow_wallet: dealDetails.escrowWallet,
        commission_rate: dealDetails.commissionRate,
        min_escrow_amount: dealDetails.minimumEscrowAmount,
        commission_wallet: dealDetails.commissionWallet,
      },
      { where: { id: dealDetails.id } }
    );
    return queryResult;
  };

  /**
   * @description updates deal status to funded.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const updateStatusToFunded = async (dealDetails) => {
    const queryResult = await BscDeal.update(
      {
        buyer_wallet: dealDetails.buyerWallet,
        deal_status: dealDetails.dealStatus,
        escrow_amount: dealDetails.totalEscrowAmount,
        fund_tx_hash: dealDetails.txHash,
      },
      { where: { escrow_wallet: dealDetails.escrowWallet } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to accepted and subsequently sets the seller.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const updateStatusToAccepted = async (dealDetails) => {
    const queryResult = await BscDeal.update(
      {
        seller_wallet: dealDetails.seller,
        deal_status: dealDetails.dealStatus,
        isDealLinkActive: false,
      },
      { where: { escrow_wallet: dealDetails.escrowWallet } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to released and subsequently sets the necessary fields.
   * @param {Object} dealDetails
   * @returns {Object}
   */
  const updateStatusToReleased = async (dealDetails) => {
    const queryResult = await BscDeal.update(
      {
        released_by: dealDetails.releasedBy,
        released_amount: dealDetails.amountReleased,
        commission_amount: dealDetails.commissionAmount,
        deal_status: dealDetails.dealStatus,
        release_tx_hash: dealDetails.txHash,
      },
      { where: { escrow_wallet: dealDetails.escrowWallet } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to refunded and subsequently sets the necessary fields.
   * @param {Object} dealDetails
   * @returns
   */
  const updateStatusToRefunded = async (dealDetails) => {
    const queryResult = await BscDeal.update(
      {
        released_by: dealDetails.buyer,
        released_amount: dealDetails.amount_withdrawn,
        commission_amount: dealDetails.commission_amount,
        deal_status: dealDetails.dealStatus,
        release_tx_hash: dealDetails.txHash,
        isDealLinkActive: false,
      },
      { where: { escrow_wallet: dealDetails.escrowWallet } }
    );
    return queryResult;
  };

  /**
   * @description updates a particular deal's status to owner withdrew and subsequently sets the necessary fields.
   * @param {Object} dealDetails
   * @returns
   */
  const updateStatusToOwnerWithdraw = async (dealDetails) => {
    const queryResult = await BscDeal.update(
      {
        released_by: dealDetails._destAddr,
        released_amount: dealDetails.amount_withdrawn,
        commission_amount: dealDetails.amount_withdrawn,
        deal_status: dealDetails.dealStatus,
        release_tx_hash: dealDetails.txHash,
        isDealLinkActive: false,
      },
      { where: { escrow_wallet: dealDetails.escrowWallet } }
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
    const queryResult = await BscDeal.findAndCountAll({
      raw: true,
      where: {
        [columnName]: val,
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
    });
    return queryResult;
  };

  const checkDealLinkStatus = async (dealDetails) => {
    const queryResult = await BscDeal.findOne({
      where: { id: dealDetails.deal_id },
    });
    return queryResult.getDataValue("isDealLinkActive");
  };

  return {
    add,
    getDealById,
    getDealsByWalletAddress,
    setEscrowWallet,
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
