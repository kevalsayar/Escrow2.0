const { BlockchainUtils } = require("../../common/blockchainUtils"),
  eUSDTAbi = require("../../../contracts/sepolia/abi/eUSDT.json"),
  { EUSDT_TOKEN_ADDRESS } = require("../../config/env"),
  { SepoliaQueries } = require("./deal.queries"),
  { ApiError } = require("../../utils/ApiError"),
  { ApiResponse } = require("../../utils/ApiResponse"),
  { ConstantMembers } = require("../../common/members");
require("./deal.listeners");

const DealServices = (() => {
  /**
   * @description Asynchronously adds deal details to the database and constructs an API response.
   * @param {Object} dealDetails - The details of the deal to be added.
   * @returns {Promise<ApiResponse>} A promise that resolves with an ApiResponse object indicating the success of the deal creation and providing the created deal's identifier and link.
   * @throws {Error} If there is an error during the deal creation.
   */
  const addDealDetails = async (dealDetails) => {
    if (
      !(await BlockchainUtils.transferTokenToAddress(
        EUSDT_TOKEN_ADDRESS,
        eUSDTAbi,
        dealDetails.wallet_address,
        dealDetails.escrow_amount
      ))
    )
      throw new ApiError(
        ConstantMembers.STATUS_CODE.BAD_REQUEST,
        ConstantMembers.SERVER_MESSAGES.request.error.internal
      );

    const result = await SepoliaQueries.add(dealDetails);

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.ENTRY_ADDED,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-created"],
      { deal_id: result.id, deal_link: result.deal_link }
    );
  };

  /**
   * @description Asynchronously retrieves deal details based on specified criteria and constructs an API response.
   * @param {Object} data - The data object containing search parameters.
   * @returns {Promise<ApiResponse>} A promise that resolves with an ApiResponse object containing the retrieved deal details or a list of deals.
   * @throws {ApiError} If the specified deal or deals are not found, it throws an appropriate ApiError with the respective status code and error message.
   */
  const getDealDetails = async (data) => {
    let queryResult;

    if (data.deal_id) {
      queryResult = await SepoliaQueries.getDealById(data.deal_id);

      if (!queryResult)
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.SERVER_MESSAGES.request.error["inexistent-resource"]
        );
    } else if (data.wallet_address) {
      queryResult = await SepoliaQueries.getDeals(
        data.filter,
        data.wallet_address,
        parseInt(data.record_limit * (data.page_num - 1)),
        parseInt(data.record_limit)
      );

      if (!queryResult.count)
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.SERVER_MESSAGES.request.error["inexistent-resource"]
        );
    }

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-info"],
      data.wallet_address
        ? {
            currentPage: parseInt(data.page_num),
            recordLimit: parseInt(data.record_limit),
            total_pages: Math.ceil(
              parseInt(queryResult.count) / parseInt(data.record_limit)
            ),
            total_records: queryResult.count,
            deal_list: queryResult.rows,
          }
        : queryResult
    );
  };

  /**
   * @description Asynchronously searches for deal information based on specified criteria and constructs an API response.
   * @param {Object} data - The data object containing search parameters.
   * @returns {Promise<ApiResponse>} A promise that resolves with an ApiResponse object containing search results.
   * @throws {ApiError} If no matching deals are found, it throws an ApiError with a NOT_FOUND status code.
   */
  const searchInfoOfDeal = async (data) => {
    const searchRes = await SepoliaQueries.getDeals(
      data.filter,
      data.wallet_address,
      parseInt(data.record_limit * (data.page_num - 1)),
      parseInt(data.record_limit),
      data.searchValue.trim()
    );

    if (!searchRes.count)
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
        total_pages: Math.ceil(searchRes.count / parseInt(data.record_limit)),
        total_records: searchRes.count,
        search_list: searchRes.rows,
      }
    );
  };

  /**
   * @description Asynchronously checks if a deal is valid for acceptance and constructs an API response.
   * @param {Object} dealInfo - Information about the deal to be accepted.
   * @returns {Promise<ApiResponse>} A promise that resolves with an ApiResponse object indicating whether the deal is valid for acceptance.
   * @throws {ApiError} If the specified deal is not found or if the deal link is inactive, it throws an appropriate ApiError with the respective status code and error message.
   */
  const acceptDealCheck = async (dealInfo) => {
    const dealDetails = await SepoliaQueries.getDealById(dealInfo.deal_id);

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
})();

module.exports = { DealServices };
