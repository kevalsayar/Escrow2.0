const { HelperFunction } = require("../../common/helpers");
const { tronWebObject } = require("../../common/utils");

const contractInstance = async function (contractAddress, contractAbi) {
  const tronContract = await HelperFunction.instantiateTronContract(
    contractAddress,
    contractAbi,
    tronWebObject
  );
  return tronContract;
};

module.exports = { contractInstance };
