/**
 * Initializes and exports a contract instance for interacting with a Sepolia contract.
 */

const { BlockchainUtils } = require("../../common/blockchainUtils"),
  EscrowFactoryAbi = require("../../../contracts/sepolia/abi/factory.json"),
  { SEPOLIA_ESCROWFACTORY_ADDRESS } = require("../env");

const factoryContractInstance = BlockchainUtils.initializeSepoliaContract(
  SEPOLIA_ESCROWFACTORY_ADDRESS,
  EscrowFactoryAbi
);

module.exports = {
  factoryContractInstance,
};
