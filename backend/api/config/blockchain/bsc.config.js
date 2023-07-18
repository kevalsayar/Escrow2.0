const { HelperFunction } = require("../../common/helpers"),
  EscrowFactoryAbi = require("../../../contracts/bsc/abi/factory.json"),
  { BSC_CONTRACT_ADDRESS } = require("../env");

const contract = HelperFunction.initializeBscContract(
  BSC_CONTRACT_ADDRESS,
  EscrowFactoryAbi
);

module.exports = {
  contract,
};
