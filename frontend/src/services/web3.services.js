import Web3 from "web3";
import {
  errorMessage,
  successMessage,
  TOAST_RESPONSE,
  CONTRACT_LISTENER,
} from "../utils/constants.utils";
import { toastMessage } from "../utils/helper.utils";

export const web3 = new Web3(window.ethereum);

/**
 * @description Metamask's installation check.
 * @returns {Boolean} - true if installed.
 */
export const metamaskInstallationCheck = () =>
  !!(window.ethereum && window.ethereum.isMetaMask);

/**
 * @description Connecting user with metamask.
 * @returns {(Object | Boolean)} - returns object if no error's thrown, else boolean.
 */
export const connectToMetaMask = async () => {
  const accountAddresses = await web3.eth.getAccounts();

  if (accountAddresses.length) return accountAddresses;
  else
    return await web3.currentProvider.request({
      method: "eth_requestAccounts",
    });
};

export const fetchAccounts = async () => await web3.eth.getAccounts();

/**
 * @description Adds BSC Testnet chain for the user.
 * @returns {Boolean} - true if no error's thrown else false.
 */
export const addChain = async (network) =>
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
        if (await addChain(network))
          if (await checkNetwork(network.CHAINID)) return true;
      } catch (error) {
        throw error;
      }
    }
    throw error;
  }
};

/**
 * @description
 * @param {*} token
 * @returns
 */
export const importTokenIntoMetaMask = async (token) =>
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

/**
 * @description Ensures the user's on the BSC Testnet chain.
 * @returns {Boolean} - true if user's on the required chain.
 */
export const checkNetwork = async (netId) =>
  (await web3.eth.getChainId()) === netId;

/**
 * @description Initializes a smart contract object.
 * @param @param {Object} abi - any smart contract's abi.
 * @param {String} contractAddress - any smart contract's address.
 * @returns {Object} - initialized contract.
 */
const initializeSmartContract = (abi, contractAddress) =>
  new web3.eth.Contract(abi, contractAddress);

/**
 * @description Generic function to send a transaction to the smart contract.
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
      if (receipt.status)
        toastMessage(
          successMessage.TRANSACTION_SUCCESS,
          "toast_tx_success",
          TOAST_RESPONSE.SUCCESS
        );
      else throw new Error(errorMessage.TRANSACTION_FAIL);
    });
};

/**
 * @description Generic function to call a constant method from the smart contract.
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
