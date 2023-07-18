const { DealTable } = require("./deal.queries"),
  { HelperFunction } = require("../../common/helpers"),
  { ConstantMembers } = require("../../common/members"),
  currentFileName = __filename.slice(__dirname.length + 1);
require("./deal.listeners");

const DealServices = function () {
  /**
   * @description user's deal details
   * @param {Object} dealDetails
   * @returns
   */
  const addDealDetails = async function (dealDetails) {
    try {
      const result = await DealTable.add(dealDetails);
      return HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.ENTRY_ADDED,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.deal.success["deal-created"],
        { deal_id: result.id, deal_link: result.deal_link }
      );
    } catch (error) {
      HelperFunction.loggerError(error, currentFileName);
      return HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.INTERNAL_SERVER_ERROR,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.deal.error.internal
      );
    }
  };

  /**
   * @description get data of deals
   * @param {string} dealId
   */
  const getDealDetails = async function (data) {
    try {
      let queryResult;
      let total_pages;
      if (data.deal_id) {
        if ((await DealTable.getDealById(data.deal_id)).rows.length) {
          queryResult = await DealTable.getDealById(data.deal_id);
        } else {
          return HelperFunction.createResponse(
            ConstantMembers.REQUEST_CODE.NOT_FOUND,
            ConstantMembers.STATUS.FALSE,
            ConstantMembers.Messages.deal.error["inexistent-resource"]
          );
        }
      } else if (data.wallet_address) {
        if (
          await DealTable.getDealsByWalletAddress(
            data.filter,
            data.wallet_address
          )
        ) {
          queryResult = await DealTable.getDealsByWalletAddress(
            data.filter,
            data.wallet_address,
            parseInt(data.record_limit * (data.page_num - 1)),
            parseInt(data.record_limit)
          );
          total_pages = Math.ceil(
            parseInt(queryResult.count) / parseInt(data.record_limit)
          );
        } else {
          return HelperFunction.createResponse(
            ConstantMembers.REQUEST_CODE.NOT_FOUND,
            ConstantMembers.STATUS.FALSE,
            ConstantMembers.Messages.deal.error["inexistent-resource"]
          );
        }
      }
      return HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.SUCCESS,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.deal.success["deal-info"],
        data.wallet_address
          ? {
              currentPage: parseInt(data.page_num),
              recordLimit: parseInt(data.record_limit),
              total_pages: total_pages,
              total_records: queryResult.count,
              deal_list: queryResult.rows,
            }
          : queryResult.rows
      );
    } catch (error) {
      HelperFunction.loggerError(error, currentFileName);
      return HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.INTERNAL_SERVER_ERROR,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.deal.error.internal
      );
    }
  };

  /**
   * @description Service for searching against a given string.
   * @param {Object} data
   * @returns {Object}
   */
  const searchInfoOfDeal = async function (data) {
    try {
      const searchResult = await DealTable.searchInfo(
        data.filter,
        data.wallet_address,
        data.searchValue.trim(),
        parseInt(data.record_limit * (data.page_num - 1)),
        parseInt(data.record_limit)
      );
      if (!searchResult.count)
        return HelperFunction.createResponse(
          ConstantMembers.REQUEST_CODE.NOT_FOUND,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.deal.error["inexistent-resource"]
        );
      return HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.SUCCESS,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.deal.success["deal-info"],
        {
          currentPage: parseInt(data.page_num),
          recordLimit: parseInt(data.record_limit),
          total_pages: searchResult.count,
          total_records: searchResult.count,
          search_list: searchResult.rows,
        }
      );
    } catch (error) {
      HelperFunction.loggerError(error, currentFileName);
      return HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.INTERNAL_SERVER_ERROR,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.deal.error.internal
      );
    }
  };

  /**
   * @description Service for checking a deal link's status.
   * @param {Object} dealInfo
   * @returns {Object}
   */
  const acceptDealCheck = async function (dealInfo) {
    try {
      if ((await DealTable.getDealById(dealInfo.deal_id)).rows.length) {
        if (await DealTable.checkDealLinkStatus(dealInfo)) {
          return HelperFunction.createResponse(
            ConstantMembers.REQUEST_CODE.SUCCESS,
            ConstantMembers.STATUS.TRUE,
            ConstantMembers.Messages.deal.success["deal-link-active"]
          );
        } else {
          return HelperFunction.createResponse(
            ConstantMembers.REQUEST_CODE.BAD_REQUEST,
            ConstantMembers.STATUS.FALSE,
            ConstantMembers.Messages.deal.error["deal-link_inactive"]
          );
        }
      } else {
        return HelperFunction.createResponse(
          ConstantMembers.REQUEST_CODE.NOT_FOUND,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.deal.error["inexistent-resource"]
        );
      }
    } catch (error) {
      HelperFunction.loggerError(error, currentFileName);
      return HelperFunction.createResponse(
        ConstantMembers.REQUEST_CODE.INTERNAL_SERVER_ERROR,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.deal.error.internal
      );
    }
  };

  return {
    addDealDetails,
    getDealDetails,
    searchInfoOfDeal,
    acceptDealCheck,
  };
};

module.exports = {
  DealServices: DealServices(),
};
