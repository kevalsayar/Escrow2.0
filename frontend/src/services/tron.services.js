import { checkError } from "../utils/helper.utils";

export const tronWeb = window?.tronLink?.tronWeb;

/**
 * @description TronLink's installation check.
 * @returns {Boolean} - true if installed.
 */
export const tronInstallationCheck = () => {
  if (window.tronLink) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description Connecting user with TronLink.
 * @returns {(Object | Boolean)} - returns wallet address if no error's thrown, else boolean.
 */
export const connectToTron = async () => {
  try {
    let res = await window?.tronLink?.request({
      method: "tron_requestAccounts",
    });
    if (res.code === 200) {
      return window.tronLink.tronWeb.defaultAddress?.base58;
    }
  } catch (error) {
    checkError(error);
    return false;
  }
};

/**
 *
 * @param {*} network
 * @returns
 */
export const switchChain = async (network) => {
  try {
    await window.tronLink?.tronWeb.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network }],
    });
    return true;
  } catch (error) {
    checkError(error);
    return false;
  }
};

/**
 *
 * @param {*} type
 * @param {*} tokenAddress
 * @returns
 */
export const importTokenIntoTronLink = async (type, tokenAddress) => {
  try {
    await window.tronLink?.tronWeb.request({
      method: "wallet_watchAsset",
      params: {
        type: type,
        options: { address: tokenAddress },
      },
    });
    return true;
  } catch (error) {
    checkError(error);
    return false;
  }
};

/**
 * @description Initializes a smart contract object.
 * @param @param {Object} abi - any smart contract's abi.
 * @param {String} contractAddress - any smart contract's address.
 * @returns {Object} - initialized contract.
 */
const initializeSmartContract = async (abi, contractAddress) =>
  await window?.tronLink?.tronWeb.contract(abi, contractAddress);

/**
 * Generic function to send a transaction to the smart contract.
 * @param {String} contractFunction - contract's function name.
 * @param {Object} functionInputs - contract's function's array of parameters.
 * @param {Object} sendInput - array of parameters necessary to send transaction.
 * @param {*} abi - any smart contract's abi.
 * @param {*} contractAddress - any smart contract's address.
 * @returns
 */
export const sendSmartContract = async (
  contractFunction,
  functionInputs,
  sendInput,
  abi,
  contractAddress
) => {
  const escrowContract = await initializeSmartContract(abi, contractAddress);
  return await escrowContract[contractFunction]
    .apply(null, functionInputs)
    .send.apply(null, sendInput);
};

/**
 * Generic function to call a constant method from the smart contract.
 * @param {String} contractFunction - contract's function name.
 * @param {Object} functionInputs - contract's function's array of parameters.
 * @param {*} abi - any smart contract's abi.
 * @param {*} contractAddress - any smart contract's address.
 * @returns
 */
export const callSmartContract = async (
  contractFunction,
  functionInputs,
  abi,
  contractAddress
) => {
  const escrowContract = await initializeSmartContract(abi, contractAddress);
  const res = await escrowContract[contractFunction]
    .apply(null, functionInputs)
    .call();
  return res;
};

/**
 * Converts an amount into Sun or from Sun, as specified.
 * @param {Number} amount - amount to be converted.
 * @param {Function} toOrFromSun - function to be used.
 */
export const sunFunctions = (amount, toOrFromSun) =>
  window?.tronLink?.tronWeb[toOrFromSun](amount);
