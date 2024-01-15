/**
 * Initializes and exports a TRON contract instance for interacting with a TRON blockchain contract.
 */

const { BlockchainUtils } = require("../../common/blockchainUtils");
const { NILE_JSON_RPC_URL, NILE_EVENT_SERVER } = require("../env");

const tronWebObject = {
  fullHost: NILE_JSON_RPC_URL,
  solidityNode: NILE_JSON_RPC_URL,
  eventServer: NILE_EVENT_SERVER,
};

/**
 * @description Asynchronously initializes a TRON contract instance with the provided contract address and ABI.
 * @param {string} contractAddress - The address of the TRON contract on the blockchain.
 * @param {Array} contractAbi - The ABI (Application Binary Interface) of the TRON contract.
 * @returns {Object} A promise that resolves with the initialized TRON contract instance.
 */
const contractInstance = async (contractAddress, contractAbi) =>
  await BlockchainUtils.instantiateTronContract(
    contractAddress,
    contractAbi,
    tronWebObject
  );

module.exports = { contractInstance };
