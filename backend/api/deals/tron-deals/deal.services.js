const { ApiError } = require("../../utils/ApiError"),
  { ApiResponse } = require("../../utils/ApiResponse"),
  { TronQueries } = require("./deal.queries"),
  { ConstantMembers } = require("../../common/members");
require("./deal.listeners");

const DealServices = () => {
  /**
   * @description Add deal details to the TronQueries and return an API response.
   * @param {Object} dealDetails - The details of the deal to be added.
   * @returns {Promise<ApiResponse>} A Promise that resolves to an ApiResponse object indicating the status of the operation.
   * @throws {Error} If there's an issue adding the deal details.
   */
  const addDealDetails = async (dealDetails) => {
    const result = await TronQueries.add(dealDetails);

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.ENTRY_ADDED,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-created"],
      { deal_id: result.id, deal_link: result.deal_link }
    );
  };

  /**
   * @description Get deal details based on provided criteria, such as deal ID or wallet address.
   * @param {Object} data - The criteria and parameters for fetching deal details.
   * @returns {Promise<ApiResponse>} A Promise that resolves to an ApiResponse object containing the retrieved deal details or a list of deals.
   * @throws {ApiError} If the requested deal or resource is not found.
   */
  const getDealDetails = async (data) => {
    let queryResult;

    let total_pages;

    if (data.deal_id) {
      queryResult = await TronQueries.getDealById(data.deal_id);

      if (!queryResult)
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.SERVER_MESSAGES.request.error["inexistent-resource"]
        );
    }

    if (data.wallet_address) {
      queryResult = await TronQueries.getDealsByWalletAddress(
        data.filter,
        data.wallet_address,
        parseInt(data.record_limit * (data.page_num - 1)),
        parseInt(data.record_limit)
      );

      if (!queryResult.rows.length)
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.SERVER_MESSAGES.request.error["inexistent-resource"]
        );
    }

    return ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-info"],
      data.wallet_address
        ? {
            currentPage: parseInt(data.page_num),
            recordLimit: parseInt(data.record_limit),
            total_pages: total_pages,
            total_records: queryResult.count,
            deal_list: queryResult.rows,
          }
        : queryResult
    );
  };

  /**
   * @description Search for deal information based on specified criteria and search string, optionally paginated.
   * @param {Object} data - The criteria and parameters for searching deal information.
   * @returns {Promise<ApiResponse>} A Promise that resolves to an ApiResponse object containing the retrieved search results.
   * @throws {ApiError} If no matching resources are found.
   */
  const searchInfoOfDeal = async (data) => {
    const searchResult = await TronQueries.searchInfo(
      data.filter,
      data.wallet_address,
      data.searchValue.trim(),
      parseInt(data.record_limit * (data.page_num - 1)),
      parseInt(data.record_limit)
    );

    if (!searchResult.count)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.SERVER_MESSAGES.request.error["inexistent-resource"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-info"],
      {
        currentPage: parseInt(data.page_num),
        recordLimit: parseInt(data.record_limit),
        total_pages: searchResult.count,
        total_records: searchResult.count,
        search_list: searchResult.rows,
      }
    );
  };

  /**
   * @description Check if a deal is valid for acceptance based on deal information.
   * @param {Object} dealInfo - The deal information to check for acceptance.
   * @returns {Promise<ApiResponse>} A Promise that resolves to an ApiResponse indicating whether the deal is valid for acceptance.
   * @throws {ApiError} If the deal is not found, or the deal link is inactive.
   */
  const acceptDealCheck = async (dealInfo) => {
    const dealDetails = await TronQueries.getDealById(dealInfo.deal_id);

    if (!dealDetails)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.NOT_FOUND,
        ConstantMembers.SERVER_MESSAGES.request.error["inexistent-resource"]
      );

    if (!dealDetails.isDealLinkActive)
      throw new ApiError(
        ConstantMembers.STATUS_CODE.BAD_REQUEST,
        ConstantMembers.SERVER_MESSAGES.deal.error["deal-link_inactive"]
      );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-link-active"]
    );
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
