export const errorMessage = {
  REQUIRED_ERROR: "Input is required",
  EMAIL_ERROR: "Email is not valid",
  CAPTCHA_WARNING: "Captcha is not resolved",
  REQUEST_DENIED: "MetaMask request denied.",
  RESOURCE_BUSY: "MetaMask resource busy. Try again later.",
  TRANSACTION_FAIL: "MetaMask transaction failed. Please try again.",
  NETWORK_ERROR: "Network Error",
  NOT_ON_BSC: "You have to be on the BSC Testnet to proceed!",
  NOT_ON_SEPOLIA: "You have to be on Sepolia to proceed!",
  WRONG_PASSWORD: "Wrong password. Try again.",
  INSTALL_METAMASK: "Install metamask to proceed!",
  INSTALL_PHANTOM: "Install phantom to proceed!",
  SAME_ACCOUNT: "Switch accounts to Accept/Release!",
  LINK_INACTIVE: "Deal Link is inactive!!",
  INSUFFICIENT_FUNDS: "Insufficient Funds!!",
  UNLOCK_WALLET: "Please manually unlock your Tron wallet from the extension!!",
  INSTALL_TRONLINK:
    "TronLink not detected, you'll now be redirected for installation!!",
  ESCROW_ID_FAILURE: "Failed to generate Escrow ID!",
  INIT_FAILURE: "Failed to initialize deal!",
  DEPOSIT_FAILURE: "Failed to deposit sol in escrow!",
  ACCEPT_FAILURE: "Failed to accept deal!",
  RELEASE_FAILURE: "Failed to release fund!",
  WITHDRAW_FAILURE: "Failed to withdraw fund!",
  SOLANA_PROGRAM_ERROR: "Solana program unavailable!",
};

export const successMessage = {
  ON_BSC_TESTNET: "You're now on BSC Testnet.",
  ON_SEPOLIA: "You're now on Sepolia.",
  TRANSACTION_SUCCESS: "Transaction's a success!",
  TRANSACTION_IN_PROCESS: "Transaction in process. Kindly wait.",
  TRONLINK_INSTALLED: "Tronlink is installed!",
  ESCROW_ID_CREATED: "New Escrow ID created!",
  DEAL_INITIATED: "New Escrow deal has been initiated!",
  DEPOSIT_SUCCESS: "Deposit of sol successful!",
  ACCEPT_SUCCESS: "Accepting deal successful!",
  RELEASE_SUCCESS: "Fund released successfully!",
  WITHDRAW_SUCCESS: "Fund withdrawn successfully!",
};

export const LS_KEYS = {
  AUTH_TOKEN: "auth-token",
};

export const NETWORK_CHAINS = {
  TRON: {
    MAINNET: "0x2b6653dc",
    SHASTA: "0x94a9059e",
    NILE: "0xcd8690dc",
  },
  BINANCE_TEST_NETWORK: {
    CHAINID: "0x61",
    CHAINNAME: "Binance Smart Chain Testnet",
    RPCURLS: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    NATIVE_CURRENCY_NAME: "Binance Coin",
    NATIVE_CURRENCY_SYMBOL: "tBNB",
    NATIVE_CURRENCY_DECIMAL: 18,
    BLOCK_EXPLORER_URL: "https://testnet.bscscan.com",
  },
  BINANCE_SMART_CHAIN: {
    CHAINID: "0x38",
    CHAINNAME: "Binance Smart Chain",
    RPCURLS: "https://bsc-dataseed1.binance.org/",
    NATIVE_CURRENCY_NAME: "Binance Coin",
    NATIVE_CURRENCY_SYMBOL: "BNB",
    NATIVE_CURRENCY_DECIMAL: 18,
    BLOCK_EXPLORER_URL: "https://bscscan.com/",
  },
  SEPOLIA: {
    CHAINID: "0xaa36a7",
    CHAINNAME: "Sepolia",
    RPCURLS: "https://sepolia.infura.io/v3/f3e5c1ea301b45abb0aeb2de13402784",
    NATIVE_CURRENCY_NAME: "Ethereum",
    NATIVE_CURRENCY_SYMBOL: "ETH",
    NATIVE_CURRENCY_DECIMAL: 18,
    BLOCK_EXPLORER_URL: "https://sepolia.etherscan.io",
  },
};

export const TOKEN_DETAILS = {
  BSC: {
    USDT_TOKEN: {
      TOKEN_ADDRESS: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      TOKEN_SYMBOL: "USDT",
      TOKEN_DECIMALS: 18,
      TOKEN_IMAGE:
        "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/logo.png",
    },
    BUSD_TOKEN: {
      TOKEN_ADDRESS: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
      TOKEN_SYMBOL: "BUSD",
      TOKEN_DECIMALS: 18,
      TOKEN_IMAGE:
        "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/logo.png",
    },
  },
  TRON: {
    TOKEN_TYPES: {
      TRC10: "trc10",
      TRC20: "trc20",
      TRC721: "trc721",
    },
    USDT_TOKEN: {
      TOKEN_ADDRESS: "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
      TOKEN_SYMBOL: "USDT",
      TOKEN_DECIMALS: 6,
      TOKEN_IMAGE:
        "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/logo.png",
    },
  },
  SEPOLIA: {
    USDT_TOKEN: {
      TOKEN_ADDRESS: "0x2867254Fef07d21967EFe25bD14dDfbf4E000e7B",
      TOKEN_SYMBOL: "USDT",
      TOKEN_DECIMALS: 18,
      TOKEN_IMAGE:
        "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818/logo.png",
    },
  },
};

export const ERROR_CODES = {
  USER_REJECTED_REQUEST: 4001,
  RESOURCE_BUSY: -32002,
  TRANSACTION_REJECTED: -32003,
};

export const CONTRACT_ADDRESSES = {
  BSC: { ESCROW_UPG_FACTORY: "0x63D3eAA566E155706286878C82AE4B8f5a750eaD" },
  TRON: { ESCROW_FACTORY: "TCmCNindaR2ET2swrPTTad6QpSY2nfNPX7" },
  SEPOLIA: { ESCROW_UPG_FACTORY: "0x62e0f7bf386Fbc5abE9138567D0956e7E86148E1" },
};

export const NETWORKS = {
  ETHEREUM_MAINNET: 1,
  SEPOLIA: 11155111,
  BINANCE_SMART_CHAIN_TEST_NETWORK: 97,
};

export const TOAST_RESPONSE = {
  SUCCESS: "success",
  ERROR: "error",
};

export const CONTRACT_LISTENER = {
  TX_HASH: "transactionHash",
  RECEIPT: "receipt",
  ERROR: "error",
};

export const WEI = {
  FROM_WEI: "fromWei",
  TO_WEI: "toWei",
};

export const SUN = {
  FROM_SUN: "fromSun",
  TO_SUN: "toSun",
};

export const etherjsWEI = {
  FROM_WEI: "formatUnits",
  TO_WEI: "parseUnits",
};

export const FILTERS = {
  CREATED: "buyer_wallet",
  ACCEPTED: "seller_wallet",
};

export const ROUTES = {
  SOLDEALS: {
    getDeals: "/deal/sol",
    postDeal: "/deal/sol",
    searchDeal: "/deal/sol/search",
    acceptDeal: "/deal/sol/accept",
    setID: "/deal/sol/setEscrowAddr",
    deposit: "/deal/sol/deposit",
    acceptDealSolana: "/deal/sol/acceptDeal",
    releaseFund: "/deal/sol/releaseFund",
    withdrawFund: "/deal/sol/withdrawFund",
  },
  SEPOLIADEALS: {
    getDeals: "/deal/bsc",
    postDeal: "/deal/bsc",
    searchDeal: "/deal/bsc/search",
    acceptDeal: "/deal/bsc/accept",
  },
  SEPOLIADEALS: {
    getDeals: "/deal/sepolia",
    postDeal: "/deal/sepolia",
    searchDeal: "/deal/sepolia/search",
    acceptDeal: "/deal/sepolia/accept",
  },
  TRONDEALS: {
    getDeals: "/deal/tron",
    postDeal: "/deal/tron",
    searchDeal: "/deal/tron/search",
    acceptDeal: "/deal/tron/accept",
  },
};

export const BGCOLOR = {
  INIT: "#000",
  FUNDED: "#71D875",
  ACCEPTED: "#FF9800",
  REFUNDED: "#e30050",
  WITHDRAWN: "#EEB200",
  RELEASED: "#ffc51a",
};

export const CONTRACT_FUNCTIONS = {
  BSC: {
    FACTORY: {
      CHANGE_COMM_RATE: "changeCommissionRate",
      CREATE_ESCROW: "createEscrowProxy",
      DEPOSIT_FUNDS: "depositFunds",
      RENOUNCE_OWNERSHIP: "renounceOwnership",
      TRANSFER_OWNERSHIP: "transferOwnership",
      OWNER: "owner",
      COMM_RATE: "commissionRateOfDeal",
      BEACON_ADDR: "escrowBeaconAddress",
      ESCROW_IMPL_ADDR: "escrowImplAddress",
      ESCROW_PROXY_ADDR: "escrowProxyAddress",
      MIN_ESCROW_AMT: "minEscrowAmount",
    },
    ESCROW: {
      ACCEPT_DEAL: "acceptDeal",
      DEPOSIT: "deposit",
      RELEASE: "releaseFund",
      WITHDRAW: "withdrawFund",
      SIX_MONTHS: "postSixMonths",
      OWNER: "owner",
      BUYER_ADDR: "buyer",
      SELLER_ADDR: "seller",
      COMM_RATE: "commissionRateOfDeal",
      DEAL_CURR_STATE: "currentStateOfDeal",
    },
  },
  TRON: {
    FACTORY: {
      CREATE_ESCROW: "createEscrowProxy",
      DEPOSIT_FUNDS: "depositFunds",
      ACCEPT: "acceptDeal",
      RELEASE: "releaseFunds",
      WITHDRAW: "withdrawFunds",
      RENOUNCE_OWNERSHIP: "renounceOwnership",
      TRANSFER_OWNERSHIP: "transferOwnership",
      CHANGE_COMM_RATE: "changeCommissionRate",
      SIX_MONTHS: "postSixMonthsFundsWithdraw",
      OWNER: "owner",
      COMM_RATE: "commissionRateOfDeal",
      BEACON_ADDR: "escrowBeaconAddress",
      ESCROW_IMPL_ADDR: "escrowImplAddress",
      ESCROW_PROXY_ADDR: "escrowProxyAddress",
      MIN_ESCROW_AMT: "minEscrowAmount",
    },
  },
  USDT_TOKEN: {
    APPROVE: "approve",
    BALANCE_OF: "balanceOf",
  },
  SEPOLIA: {
    FACTORY: {
      CHANGE_COMM_RATE: "changeCommissionRate",
      CREATE_ESCROW: "createEscrowProxy",
      DEPOSIT_FUNDS: "depositFunds",
      RENOUNCE_OWNERSHIP: "renounceOwnership",
      TRANSFER_OWNERSHIP: "transferOwnership",
      OWNER: "owner",
      COMM_RATE: "commissionRateOfDeal",
      BEACON_ADDR: "escrowBeaconAddress",
      ESCROW_IMPL_ADDR: "escrowImplAddress",
      ESCROW_PROXY_ADDR: "escrowProxyAddress",
      MIN_ESCROW_AMT: "minEscrowAmount",
    },
    ESCROW: {
      ACCEPT_DEAL: "acceptDeal",
      DEPOSIT: "deposit",
      RELEASE: "releaseFund",
      WITHDRAW: "withdrawFund",
      SIX_MONTHS: "postSixMonths",
      OWNER: "owner",
      BUYER_ADDR: "buyer",
      SELLER_ADDR: "seller",
      COMM_RATE: "commissionRateOfDeal",
      DEAL_CURR_STATE: "currentStateOfDeal",
    },
  },
  SOL: {
    CREATE_ESCROW: "newEscrowId",
    INITIALIZE_DEAL: "initializeDeal",
    DEPOSIT_FUNDS: "deposit",
    ACCEPT_DEAL: "acceptDeal",
    RELEASE_FUND: "releaseFund",
    WITHDRAW_FUND: "withdrawFund",
  },
};

export const TOKEN = Object.freeze({
  SOL: "SOL",
  BNB: "BNB",
  USDT: "USDT",
});

export const clientRoutes = Object.freeze({
  dashboard: "/dashboard",
  transactions: "/transactions",
  newDeal: "/new-deal",
  acceptDeal: "/accept",
  acceptDealParamRoute: /.(accept)\?(((id)=.*)(&?))/g,
});

export const STATUS_CODES = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

export const walletTypes = Object.freeze({
  metamask: "metamask",
  phantom: "phantom",
  tronlink: "tronlink",
  pseudoPhantom: "pseudoPhantom",
});

export const API_METHODS = Object.freeze({
  GET: "get",
  POST: "post",
  PATCH: "patch",
});

export const DEALS_PER_PAGE = 3;

export const TOOLTIP_TIMER = 1000;
