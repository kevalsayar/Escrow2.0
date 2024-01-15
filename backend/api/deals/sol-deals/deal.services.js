const { SolQueries } = require("./deal.queries"),
  { ApiError } = require("../../utils/ApiError"),
  { ApiResponse } = require("../../utils/ApiResponse"),
  { ConstantMembers } = require("../../common/members"),
  { SolanaHandlers } = require("../../common/solanaUtils");

const DealServices = (() => {
  /**
   * @description Adds details for a new SolDeal.
   * @param {object} dealDetails - Details of the new SolDeal.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success of the operation.
   */
  const addDealDetails = async function (dealDetails) {
    const result = await SolQueries.add(dealDetails);

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.ENTRY_ADDED,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-created"],
      { deal_id: result.id, deal_link: result.deal_link }
    );
  };

  /**
   * @description Retrieves details of SolDeals based on provided criteria.
   * @param {object} data - Criteria for retrieving SolDeals.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse containing SolDeal information.
   */
  const getDealDetails = async function (data) {
    let queryResult;

    if (data.deal_id) {
      queryResult = await SolQueries.getDealById(data.deal_id);

      if (!queryResult)
        throw new ApiError(
          ConstantMembers.STATUS_CODE.NOT_FOUND,
          ConstantMembers.SERVER_MESSAGES.request.error["inexistent-resource"]
        );
    } else if (data.wallet_address) {
      queryResult = await SolQueries.getDeals(
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
   * @description Searches for SolDeals based on provided criteria.
   * @param {object} data - Criteria for searching SolDeals.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse containing SolDeal search results.
   */
  const searchInfoOfDeal = async function (data) {
    const searchRes = await SolQueries.getDeals(
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
   * @description Checks the eligibility of a SolDeal for acceptance.
   * @param {object} dealInfo - Information about the SolDeal to check for acceptance.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the eligibility of the SolDeal for acceptance.
   */
  const acceptDealCheck = async function (dealInfo) {
    const dealDetails = await SolQueries.getDealById(dealInfo.deal_id);

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

  /**
   * @description Sets the escrow account details for a SolDeal.
   * @param {object} dealInfo - Information about the SolDeal.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success of the operation.
   */
  const setEscrowAccountId = async function (dealInfo) {
    const escrowData = await SolanaHandlers.getAccountData(dealInfo.deal_id);

    await SolQueries.updateDealDetails(
      {
        escrow_wallet: await SolanaHandlers.getEscrowAddress(dealInfo.deal_id),
        commission_rate: escrowData.commissionrate.toString(),
        min_escrow_amount: escrowData.minimumescrowAmount.toString(),
        commission_wallet: escrowData.commissionwallet.toString(),
      },
      { id: dealInfo.deal_id }
    );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-updated"]
    );
  };

  /**
   * @description Handles the deposit service for a funded SolDeal.
   * @param {object} dealInfo - Information about the SolDeal deposit.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success of the operation.
   */
  const depositService = async function (dealInfo) {
    await SolQueries.updateDealDetails(
      {
        buyer_wallet: (
          await SolanaHandlers.getAccountData(dealInfo.deal_id)
        ).owner.toString(),
        deal_status: ConstantMembers.DEAL_STATUS.FUNDED,
        fund_tx_hash: dealInfo.txHash,
      },
      { id: dealInfo.deal_id }
    );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-updated"]
    );
  };

  /**
   * @description Handles the acceptance of a SolDeal by the seller.
   * @param {object} dealInfo - Information about the accepted SolDeal.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success of the operation.
   */
  const acceptDealService = async function (dealInfo) {
    await SolQueries.updateDealDetails(
      {
        seller_wallet: (
          await SolanaHandlers.getAccountData(dealInfo.deal_id)
        ).seller.toString(),
        deal_status: ConstantMembers.DEAL_STATUS.ACCEPTED,
        isDealLinkActive: false,
      },
      { id: dealInfo.deal_id }
    );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-updated"]
    );
  };

  /**
   * @description Handles the release of funds for a SolDeal.
   * @param {object} dealInfo - Information about the released funds in the SolDeal.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success of the operation.
   */
  const releaseFundService = async function (dealInfo) {
    const escrowData = await SolanaHandlers.getAccountData(dealInfo.deal_id);

    await SolQueries.updateDealDetails(
      {
        released_by: escrowData.realesedBy.toString(),
        released_amount: escrowData.releasedAmount.toString(),
        commission_amount: escrowData.commissionAmount.toString(),
        deal_status: ConstantMembers.DEAL_STATUS.RELEASED,
        release_tx_hash: dealInfo.txHash,
      },
      { id: dealInfo.deal_id }
    );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-updated"]
    );
  };

  /**
   * @description Handles the withdrawal of funds for a refunded SolDeal.
   * @param {object} dealInfo - Information about the withdrawn funds in the SolDeal.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success of the operation.
   */
  const withdrawFundService = async function (dealInfo) {
    const escrowData = await SolanaHandlers.getAccountData(dealInfo.deal_id);

    await SolQueries.updateDealDetails(
      {
        released_by: escrowData.realesedBy.toString(),
        released_amount: escrowData.releasedAmount.toString(),
        commission_amount: escrowData.commissionAmount.toString(),
        deal_status: ConstantMembers.DEAL_STATUS.REFUNDED,
        isDealLinkActive: false,
        release_tx_hash: dealInfo.txHash,
      },
      { id: dealInfo.deal_id }
    );

    return new ApiResponse(
      ConstantMembers.STATUS_CODE.SUCCESS,
      ConstantMembers.SERVER_MESSAGES.deal.success["deal-updated"]
    );
  };

  return {
    addDealDetails,
    getDealDetails,
    searchInfoOfDeal,
    acceptDealCheck,
    setEscrowAccountId,
    depositService,
    acceptDealService,
    releaseFundService,
    withdrawFundService,
  };
})();

module.exports = { DealServices };
