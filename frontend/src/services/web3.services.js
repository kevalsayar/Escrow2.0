import Web3 from "web3";
import {
  errorMessage,
  successMessage,
  TOAST_RESPONSE,
  CONTRACT_LISTENER,
} from "../utils/constants.utils";
import { toastMessage } from "../utils/helper.utils";
import { checkError } from "../utils/helper.utils";

export const web3 = new Web3(window.ethereum);

/**
 * @description Metamask's installation check.
 * @returns {Boolean} - true if installed.
 */
export const metamaskInstallationCheck = () => {
  if (window.ethereum && window.ethereum.isMetaMask) return true;
  else {
    return false;
  }
};

/**
 * @description Connecting user with metamask.
 * @returns {(Object | Boolean)} - returns object if no error's thrown, else boolean.
 */
export const connectToMetaMask = async () => {
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    return accounts;
  } else {
    try {
      const accounts = await web3.currentProvider.request({
        method: "eth_requestAccounts",
      });
      return accounts;
    } catch (error) {
      checkError(error);
      return false;
    }
  }
};

export const fetchAccounts = async () => await web3.eth.getAccounts();

// TODO: Change to mainnet pre-deployment.
/**
 * @description Adds BSC Testnet chain for the user.
 * @returns {Boolean} - true if no error's thrown else false.
 */

export const addChain = async (network) => {
  try {
    await web3.currentProvider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: network.CHAINID,
          chainName: network.CHAINNAME,
          rpcUrls: [network.RPCURLS],
          nativeCurrency: {
            name: network.NATIVE_CURRENCY_NAME,
            symbol: network.NATIVE_CURRENCY_SYMBOL,
            decimals: network.NATIVE_CURRENCY_DECIMAL,
          },
          blockExplorerUrls: [network.BLOCK_EXPLORER_URL],
        },
      ],
    });
    return true;
  } catch (error) {
    checkError(error);
    return false;
  }
};

export const switchChain = async (network) => {
  try {
    await web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.CHAINID }],
    });
    return true;
  } catch (error) {
    if (error.code === 4902) {
      try {
        let res = await addChain(network);
        if (res) {
          if (await checkNetwork(network.CHAINID)) return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};

export const importTokenIntoMetaMask = async (token) => {
  try {
    await web3.currentProvider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.TOKEN_ADDRESS,
          symbol: token.TOKEN_SYMBOL,
          decimals: token.TOKEN_DECIMALS,
          image: token.TOKEN_IMAGE,
        },
      },
    });
    return true;
  } catch (error) {
    checkError(error);
    return false;
  }
};

/**
 * @description Ensures the user's on the BSC Testnet chain.
 * @returns {Boolean} - true if user's on the required chain.
 */
export const checkNetwork = async (netId) => {
  try {
    const networkId = await web3.eth.getChainId();
    // TODO: Change to BSC Mainnet pre-deployment.
    if (networkId === netId) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * @description Initializes a smart contract object.
 * @param @param {Object} abi - any smart contract's abi.
 * @param {String} contractAddress - any smart contract's address.
 * @returns {Object} - initialized contract.
 */
const initializeSmartContract = (abi, contractAddress) =>
  new web3.eth.Contract(abi, contractAddress);

/**
 * Generic function to send a transaction to the smart contract.
 * @param {String} contractFunction - contract's function name.
 * @param {Object} functionInput - contract's function's array of parameters.
 * @param {Object} sendInput - array of parameters necessary to send transaction.
 * @returns {Object}
 */
export const sendSmartContract = (
  contractFunction,
  functionInput,
  sendInput,
  abi,
  contractAddress
) => {
  const escrowContract = initializeSmartContract(abi, contractAddress);
  return escrowContract.methods[contractFunction]
    .apply(null, functionInput)
    .send.apply(null, sendInput)
    .on(CONTRACT_LISTENER.TX_HASH, function () {
      toastMessage(
        successMessage.TRANSACTION_IN_PROCESS,
        "toast_tx_success",
        TOAST_RESPONSE.SUCCESS
      );
    })
    .on(CONTRACT_LISTENER.RECEIPT, function (receipt) {
      if (receipt.status === true) {
        toastMessage(
          successMessage.TRANSACTION_SUCCESS,
          "toast_tx_success",
          TOAST_RESPONSE.SUCCESS
        );
      } else {
        toastMessage(
          errorMessage.TRANSACTION_FAIL,
          "toast_tx_error",
          TOAST_RESPONSE.ERROR
        );
      }
    })
    .on(CONTRACT_LISTENER.ERROR, function (error) {
      checkError(error);
    });
};

/**
 * Generic function to call a constant method from the smart contract.
 * @param {String} contractFunction - contract's function name.
 * @param {Object} functionInputs - contract's function's array of parameters.
 * @returns {Object}
 */
export const callSmartContract = async (
  contractFunction,
  functionInputs,
  abi,
  contractAddress
) => {
  const escrowContract = initializeSmartContract(abi, contractAddress);
  return escrowContract.methods[contractFunction]
    .apply(null, functionInputs)
    .call()
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
  web3.utils[toOrFromWei](amount);
