/**
 * A module containing constant values and messages for various parts of the application.
 *
 * @returns {Object} An object containing constant values and messages.
 */
const ConstantMembers = (() => {
  const SERVER_MESSAGES = {
    request: {
      validationError: {
        "required-req-body":
          "A required request body parameter was not included in the request!",
        "required-query-params":
          "A required query parameter was not included in the request!",
        "required-path-params":
          "A required path parameter was not included in the request!",
      },
      error: {
        internal:
          "Server encountered an unexpected condition that prevented it from fulfilling the request!",
        "inexistent-resource": "Can not map the specified URl to a resource!",
        "existent-resource": "Duplicate resource are not permitted!",
        unauthorized: "Access denied for requested admin route!",
        blocked: "User blocked, contact administrator for further information!",
      },
    },
    deal: {
      success: {
        "deal-created":
          "Request has succeeded and has led to the creation of a resource.",
        "deal-info":
          "The resource has been fetched and is transmitted in the data body.",
        "deal-deleted":
          "Request has succeeded and has led to the deletion of a resource.",
        "deal-link-active": "Deal Link's Active.",
      },
      error: {
        "amount-less-than-minimum":
          "Escrow amount should be greater or equal to the minimum amount!",
        "deal-link_inactive": "Deal Link's Inactive!",
      },
    },
  };

  const STATUS_CODE = {
    SUCCESS: 200,
    ENTRY_ADDED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED_USER: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };

  const DEAL_STATUS = Object.freeze({
    FUNDED: "FUNDED",
    ACCEPTED: "ACCEPTED",
    RELEASED: "RELEASED",
    REFUNDED: "REFUNDED",
    WITHDRAWN_BY_OWNER: "WITHDRAWN_BY_OWNER",
  });

  const API_STATUS = {
    TRUE: true,
    FALSE: false,
  };

  const CONTRACT_EVENTS = {
    SEPOLIA: {
      NEW_PROXY_ADDRESS: "NewProxyAddress",
      FUNDED: "Funded",
      ACCEPTED: "Accepted",
      RELEASE_FUND: "ReleaseFund",
      WITHDRAW: "Withdraw",
      SIX_MONTHS: "SixMonths",
    },
    TRON: {
      NEW_PROXY_ADDRESS: "NewProxyAddress",
      FUNDED: "DealFunded",
      ACCEPTED: "DealAccepted",
      RELEASE_FUND: "DealReleaseFund",
      WITHDRAW: "DealWithdraw",
      SIX_MONTHS: "DealSixMonths",
    },
  };

  const ENDPOINTS = Object.freeze({
    ROOT: "/",
    APIDOCS: "/apidocs",
    V1: "/v1",
    DEAL: "/deal",
    DELETE: "/delete",
    SEARCH: "/search",
    ACCEPT_DEAL: "/accept",
    SEPOLIA: { SEPOLIA_DEALS: "/sepolia" },
    TRON: { TRON_DEALS: "/tron" },
    SOLANA: {
      SOL_DEALS: "/sol",
      ACCEPT_LINK_VALID: "/accept",
      SET_ESCROW_ADDRESS: "/setEscrowAddr",
      DEPOSIT: "/deposit",
      ACCEPT_DEAL: "/acceptDeal",
      RELEASE_FUND: "/releaseFund",
      WITHDRAW_FUND: "/withdrawFund",
    },
  });

  const HTML_TEMPLATES = Object.freeze({
    DEAL_CREATED: "deal-created",
    DEAL_FUNDED: "deal-funded",
    DEAL_ACCEPTED: "deal-accepted",
    DEAL_FUND_RELEASED: "deal-fund-released",
    DEAL_FUND_WITHDRAWN: "deal-fund-withdrawn",
  });

  const ETHERS_WEI_CONSTANTS = {
    FROM_WEI: "formatUnits",
    TO_WEI: "parseUnits",
  };

  return {
    SERVER_MESSAGES,
    STATUS_CODE,
    API_STATUS,
    ENDPOINTS,
    HTML_TEMPLATES,
    DEAL_STATUS,
    CONTRACT_EVENTS,
    ETHERS_WEI_CONSTANTS,
  };
})();

module.exports = { ConstantMembers };
