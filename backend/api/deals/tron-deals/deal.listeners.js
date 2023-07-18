const { HelperFunction } = require("../../common/helpers"),
  { contractInstance } = require("../../config/blockchain/tron.config"),
  EscrowFactoryAbi = require("../../../contracts/tron/abi/factory.json"),
  { ConstantMembers } = require("../../common/members"),
  { DealTable } = require("./deal.queries"),
  { TRON_CONTRACT_ADDRESS } = require("../../config/env"),
  { tronWebObject } = require("../../common/utils"),
  { logger } = require("../../config/logger.config");

(async function () {
  const tronContract = await contractInstance(
    TRON_CONTRACT_ADDRESS,
    EscrowFactoryAbi
  );
  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.NEW_PROXY_ADDRESS]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.NEW_PROXY_ADDRESS}" event:`,
          err
        );
      if ((await DealTable.getDealById(event.result.dealId)).rows.length) {
        await DealTable.setEscrowWallet({
          id: event.result.dealId,
          commissionRate: event.result.commissionRate.toString(),
          escrowWallet: HelperFunction.fromHex(
            event.result.NewProxyAddress,
            tronWebObject
          ),
          minimumEscrowAmount: event.result.minimumEscrowAmount,
          commissionWallet: HelperFunction.fromHex(
            event.result.commissionWallet,
            tronWebObject
          ),
        });
        // const tronAddress = HelperFunction.fromHex(
        //   event.result.NewProxyAddress,
        //   tronWebObject
        // );

        // const escrowContract = await contractInstance(tronAddress, EscrowAbi);

        // escrowContract.Funded().watch(async (err, event) => {
        //   if (err) return logger.error('Error with "Funded" event:', err);
        //   try {
        //     await DealTable.updateStatusToFunded({
        //       buyerWallet: event.result.buyer,
        //       dealStatus: ConstantMembers.DEAL_STATUS.FUNDED,
        //       escrowWallet: event.result.escrowWallet,
        //       totalEscrowAmount: event.result.totalEscrowAmount,
        //       txHash: event.result.transaction,
        //     });
        //   } catch (error) {
        //     logger.error(error);
        //   }
        // });

        // escrowContract.Accepted().watch(async (err, event) => {
        //   if (err) return logger.error('Error with "Accepted" event:', err);
        //   try {
        //     await DealTable.updateStatusToAccepted({
        //       dealStatus: ConstantMembers.DEAL_STATUS.ACCEPTED,
        //       escrowWallet: event.result.escrowWallet,
        //       seller: event.result.seller,
        //     });
        //   } catch (error) {
        //     logger.error(error);
        //   }
        // });

        // escrowContract.ReleaseFund().watch(async (err, event) => {
        //   if (err) return logger.error('Error with "ReleaseFund" event:', err);
        //   try {
        //     await DealTable.updateStatusToReleased({
        //       dealStatus: ConstantMembers.DEAL_STATUS.RELEASED,
        //       escrowWallet: event.result.escrowWallet,
        //       releasedBy: event.result.released_by,
        //       amountReleased: event.result.amount_released.toString(),
        //       commissionAmount: commission_amount.toString(),
        //       txHash: event.result.transaction,
        //     });
        //   } catch (error) {
        //     logger.error(error);
        //   }
        // });

        // escrowContract.Withdraw().watch(async (err, event) => {
        //   if (err) return logger.error('Error with "Withdraw" event:', err);
        //   try {
        //     await DealTable.updateStatusToRefunded({
        //       dealStatus: ConstantMembers.DEAL_STATUS.REFUNDED,
        //       escrowWallet: event.result.escrowWallet,
        //       buyer: event.result.buyer,
        //       amount_withdrawn: event.result.amount_withdrawn.toString(),
        //       commission_amount: event.result.commission_amount.toString(),
        //       txHash: event.result.transaction,
        //     });
        //   } catch (error) {
        //     logger.error(error);
        //   }
        // });

        // escrowContract.SixMonths().watch(async (err, event) => {
        //   if (err) return logger.error('Error with "SixMonths" event:', err);
        //   try {
        // await DealTable.updateStatusToOwnerWithdraw({
        //   dealStatus: ConstantMembers.DEAL_STATUS.WITHDRAWN_BY_OWNER,
        //   escrowWallet: event.escrowWallet,
        //   _destAddr: event._destAddr,
        //   amount_withdrawn: event.amount_withdrawn.toString(),
        //   txHash: event.transaction,
        // });
        //   } catch (error) {
        //     logger.error(error);
        //   }
        // });
      }
    }
  );
  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.FUNDED]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.FUNDED}" event:`,
          err
        );
      try {
        await DealTable.updateStatusToFunded({
          id: event.result.dealId,
          buyerWallet: HelperFunction.fromHex(
            event.result.buyer,
            tronWebObject
          ),
          dealStatus: ConstantMembers.DEAL_STATUS.FUNDED,
          totalEscrowAmount: event.result.totalEscrowAmount.toString(),
          txHash: event.transaction,
        });
      } catch (error) {
        logger.error(error);
      }
    }
  );
  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.ACCEPTED]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.ACCEPTED}" event:`,
          err
        );
      try {
        await DealTable.updateStatusToAccepted({
          dealStatus: ConstantMembers.DEAL_STATUS.ACCEPTED,
          escrowWallet: HelperFunction.fromHex(
            event.result.escrowWallet,
            tronWebObject
          ),
          seller: HelperFunction.fromHex(event.result.seller, tronWebObject),
        });
      } catch (error) {
        logger.error(error);
      }
    }
  );
  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.RELEASE_FUND]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.RELEASE_FUND}" event:`,
          err
        );
      try {
        await DealTable.updateStatusToReleased({
          dealStatus: ConstantMembers.DEAL_STATUS.RELEASED,
          escrowWallet: HelperFunction.fromHex(
            event.result.escrowWallet,
            tronWebObject
          ),
          releasedBy: HelperFunction.fromHex(
            event.result.released_by,
            tronWebObject
          ),
          amountReleased: event.result.amount_released.toString(),
          commissionAmount: event.result.commission_amount.toString(),
          txHash: event.transaction,
        });
      } catch (error) {
        logger.error(error);
      }
    }
  );
  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.WITHDRAW]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.WITHDRAW}" event:`,
          err
        );
      try {
        await DealTable.updateStatusToRefunded({
          dealStatus: ConstantMembers.DEAL_STATUS.REFUNDED,
          escrowWallet: HelperFunction.fromHex(
            event.result.escrowWallet,
            tronWebObject
          ),
          buyer: HelperFunction.fromHex(event.result._buyer, tronWebObject),
          amount_withdrawn: event.result.amount_withdrawn.toString(),
          commission_amount: event.result.commission_amount.toString(),
          txHash: event.transaction,
        });
      } catch (error) {
        logger.error(error);
      }
    }
  );
  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.SIX_MONTHS]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.SIX_MONTHS}" event:`,
          err
        );
      try {
        await DealTable.updateStatusToOwnerWithdraw({
          dealStatus: ConstantMembers.DEAL_STATUS.WITHDRAWN_BY_OWNER,
          escrowWallet: event.result.escrowWallet,
          _destAddr: event.result._destAddr,
          amount_withdrawn: event.result.amount_withdrawn.toString(),
          txHash: event.transaction,
        });
      } catch (error) {
        logger.error(error);
      }
    }
  );
})();

// Sample Event Object.
// {
//   block: 35475881,
//   timestamp: 1680258057000,
//   contract: 'TQERwyQ6ZZMuDADLCB9HreWCUp3AV5cn59',
//   name: 'DealReleaseFund',
//   transaction: '6c0f53d368a7bb6274038c3eaf90d6601ec1c60aee75e16764f17778bbd89139',
//   result: {
//     '0': '0x60f51d4a09e0678d0d7e148dccc2c752b12fac0e',
//     '1': '0x683eb7244d77c7541c55b481636d61e8648c4ff1',
//     '2': '1960000',
//     '3': '40000',
//     amount_released: '1960000',
//     commission_amount: '40000',
//     released_by: '4160f51d4a09e0678d0d7e148dccc2c752b12fac0e',
//     escrowWallet: '41683eb7244d77c7541c55b481636d61e8648c4ff1'
//   },
//   resourceNode: 'fullNode',
//   unconfirmed: true
// }
