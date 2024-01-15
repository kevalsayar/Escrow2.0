const { BlockchainUtils } = require("../../common/blockchainUtils"),
  {
    factoryContractInstance,
  } = require("../../config/blockchain/sepolia.config"),
  EscrowAbi = require("../../../contracts/sepolia/abi/escrow.json"),
  { ConstantMembers } = require("../../common/members"),
  { Op } = require("sequelize"),
  { SepoliaQueries } = require("./deal.queries");

(async function () {
  try {
    /**
     * Event listener for the 'NEW_PROXY_ADDRESS' event on the Sepolia contract.
     *
     * This listener handles the event when a new proxy address is created on the blockchain.
     * It updates the deal information in the database and sets up listeners for the newly created proxy address.
     *
     * @param {NewProxyAddress} NewProxyAddress - The newly created proxy address.
     * @param {string} dealId - The unique identifier of the deal associated with the proxy address.
     * @param {number} commissionRate - The commission rate for the deal.
     * @param {number} minimumEscrowAmount - The minimum escrow amount for the deal.
     * @param {string} commissionWallet - The wallet address for commission payments.
     * @returns {void}
     */
    factoryContractInstance.on(
      ConstantMembers.CONTRACT_EVENTS.SEPOLIA.NEW_PROXY_ADDRESS,
      async (
        NewProxyAddress,
        dealId,
        commissionRate,
        minimumEscrowAmount,
        commissionWallet
      ) => {
        if (await SepoliaQueries.getDealById(dealId)) {
          await SepoliaQueries.updateDealDetails(
            {
              escrow_wallet: NewProxyAddress,
              commission_rate: commissionRate.toString(),
              min_escrow_amount: minimumEscrowAmount.toString(),
              commission_wallet: commissionWallet,
            },
            { id: dealId }
          );

          BlockchainUtils.setupEventListeners(NewProxyAddress, EscrowAbi);
        }
      }
    );

    const { count, rows } = await SepoliaQueries.getDeals("deal_status", {
      [Op.or]: ["INIT", "FUNDED", "ACCEPTED"],
    });

    if (count)
      rows
        .filter(
          ({ escrow_wallet: escrowWallet }) =>
            escrowWallet && escrowWallet.trim() !== ""
        )
        .forEach(async ({ escrow_wallet: escrowWallet }) => {
          await BlockchainUtils.setupEventListeners(escrowWallet, EscrowAbi);
        });
  } catch (error) {
    console.log("ERROR: ", error);
  }
})();
