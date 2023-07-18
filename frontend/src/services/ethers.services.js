import { ethers } from "ethers";
import {
  BINANCE_TEST_NETWORK,
  NETWORKS,
  CONTRACT_ADDRESSES,
  errorMessage,
  successMessage,
  TOAST_RESPONSE,
} from "../utils/constants.utils";
import { toastMessage, checkError } from "../utils/helper.utils";
import escrowabiArray from "../abi/escrowabi.json";

export const provider = new ethers.providers.Web3Provider(window.ethereum);

/**
 * Metamask's installation check.
 * @returns {Boolean} - true if installed.
 */
export const metamaskInstallationCheck = () => {
  if (window.ethereum && window.ethereum.isMetaMask) return true;
  else {
    toastMessage(
      errorMessage.INSTALL_METAMASK,
      "toast_installation_error",
      TOAST_RESPONSE.ERROR
    );
    return false;
  }
};

/**
 * Connecting user with metamask.
 * @returns {(Object | Boolean)} - returns object if no error's thrown, else boolean.
 */
export const connectToMetaMask = async () => {
  const accounts = await provider.listAccounts();
  if (!accounts.length) {
    try {
      const accounts = await provider.send("eth_requestAccounts");
      toastMessage(
        `Connected with ${
          accounts[0].substring(0, 5) +
          "..." +
          accounts[0].substring(accounts[0].length - 5)
        }`,
        "toast_address_success",
        TOAST_RESPONSE.SUCCESS
      );
      return accounts;
    } catch (error) {
      checkError(error);
      return false;
    }
  } else {
    return accounts;
  }
};

// TODO: Change to mainnet pre-deployment.
/**
 * Adds BSC Testnet chain for the user.
 * @returns {Boolean} - true if no error's thrown else false.
 */
export const addChain = async () => {
  try {
    await provider.send("wallet_addEthereumChain", [
      {
        chainId: BINANCE_TEST_NETWORK.CHAINID,
        chainName: BINANCE_TEST_NETWORK.CHAINNAME,
        rpcUrls: [BINANCE_TEST_NETWORK.RPCURLS],
        nativeCurrency: {
          name: BINANCE_TEST_NETWORK.NATIVE_CURRENCY_NAME,
          symbol: BINANCE_TEST_NETWORK.NATIVE_CURRENCY_SYMBOL,
          decimals: BINANCE_TEST_NETWORK.NATIVE_CURRENCY_DECIMAL,
        },
        blockExplorerUrls: [BINANCE_TEST_NETWORK.BLOCK_EXPLORER_URL],
      },
    ]);
    return true;
  } catch (error) {
    checkError(error);
    return false;
  }
};

/**
 * Ensures the user's on the BSC Testnet chain.
 * @returns {Boolean} - true if user's on the required chain else false.
 */
export const checkNetwork = async () => {
  const networkId = await provider.getNetwork().chainId;
  // TODO: Change to BSC Mainnet pre-deployment.
  if (networkId === NETWORKS.BINANCE_SMART_CHAIN_TEST_NETWORK) {
    return true;
  } else {
    toastMessage(
      errorMessage.NOT_ON_BSC,
      "toast_notOnBscTestnet_error",
      TOAST_RESPONSE.ERROR
    );
    return false;
  }
};

/**
 * Initializes a smart contract object.
 * @param @param {Object} abi - any smart contract's abi.
 * @param {String} contractAddress - any smart contract's address.
 * @param {Object} providerOrSigner - 'provider', 'signer' for readOnly & stateChanging methods respectively.
 * @returns {Object} - initialized contract.
 */
export const initializeSmartContract = (
  abi,
  contractAddress,
  providerOrSigner
) => new ethers.Contract(contractAddress, abi, providerOrSigner);

/**
 * Generic function to send a transaction to the smart contract.
 * @param {String} contractFunction - contract's function name.
 * @param {Object} functionInput - contract's function's array of parameters.
 * @returns {Object}
 */
export const sendSmartContract = (contractFunction, functionInput) => {
  const signer = provider.getSigner();
  const escrowContract = initializeSmartContract(
    escrowabiArray,
    CONTRACT_ADDRESSES.ESCROW,
    signer
  );
  return escrowContract[contractFunction]
    .apply(null, functionInput)
    .then(async function (result) {
      toastMessage(
        successMessage.TRANSACTION_IN_PROCESS,
        "toast_tx_success",
        TOAST_RESPONSE.SUCCESS
      );
      if ((await result.wait()).status === 1) {
        toastMessage(
          successMessage.TRANSACTION_SUCCESS,
          "toast_tx_success",
          TOAST_RESPONSE.SUCCESS
        );
      }
    })
    .catch(function (error) {
      checkError(error);
    });
};

/**
 * Generic function to call a constant method from the smart contract.
 * @param {String} contractFunction - contract's function name.
 * @param {Object} functionInputs - contract's function's array of parameters.
 * @returns {Boolean}
 */
export const callSmartContract = async (contractFunction, functionInputs) => {
  const escrowContract = initializeSmartContract(
    escrowabiArray,
    CONTRACT_ADDRESSES.ESCROW,
    provider
  );
  return escrowContract[contractFunction]
    .apply(null, functionInputs)
    .then(function (result) {
      return result;
    });
};

/**
 * Converts an amount into Wei or from Wei, as specified.
 * @param {Number} amount - amount to be converted.
 * @param {Function} toOrFromWei - function to be used.
 */
export const weiFunctions = (amount, toOrFromWei) =>
  ethers.utils[toOrFromWei](amount).toString();

// console.log("eth", ethers.utils.parseUnits("1").toString());
// console.log("eth", ethers.utils.formatUnits("1000000000000000000").toString());
