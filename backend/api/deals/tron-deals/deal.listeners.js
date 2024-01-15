const { BlockchainUtils } = require("../../common/blockchainUtils"),
  { contractInstance } = require("../../config/blockchain/tron.config"),
  EscrowFactoryAbi = require("../../../contracts/tron/abi/factory.json"),
  { ConstantMembers } = require("../../common/members"),
  { TronQueries } = require("./deal.queries"),
  { TRON_CONTRACT_ADDRESS } = require("../../config/env"),
  { tronWebObject } = require("../../common/utils"),
  { logger } = require("../../config/logger.config");

(async () => {
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

      if (await TronQueries.getDealById(event.result.dealId)) {
        await TronQueries.updateDealDetails(
          {
            escrow_wallet: BlockchainUtils.fromHex(
              event.result.NewProxyAddress,
              tronWebObject
            ),
            commission_rate: event.result.commissionRate.toString(),
            min_escrow_amount: event.result.minimumEscrowAmount,
            commission_wallet: BlockchainUtils.fromHex(
              event.result.commissionWallet,
              tronWebObject
            ),
          },
          { id: event.result.dealId }
        );
        // const tronAddress = BlockchainUtils.fromHex(
        //   event.result.NewProxyAddress,
        //   tronWebObject
        // );

        // const escrowContract = await contractInstance(tronAddress, EscrowAbi);

        // escrowContract.Funded().watch(async (err, event) => {
        //   if (err) return logger.error('Error with "Funded" event:', err);
        //   try {
        //     await TronQueries.updateStatusToFunded({
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
        //     await TronQueries.updateStatusToAccepted({
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
        //     await TronQueries.updateStatusToReleased({
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
        //     await TronQueries.updateStatusToRefunded({
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
        // await TronQueries.updateStatusToOwnerWithdraw({
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

      await TronQueries.updateDealDetails(
        {
          buyer_wallet: BlockchainUtils.fromHex(
            event.result.buyer,
            tronWebObject
          ),
          deal_status: ConstantMembers.DEAL_STATUS.FUNDED,
          escrow_amount: event.result.totalEscrowAmount.toString(),
          fund_tx_hash: event.transaction,
        },
        { id: event.result.dealId }
      );
    }
  );

  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.ACCEPTED]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.ACCEPTED}" event:`,
          err
        );

      await TronQueries.updateDealDetails(
        {
          seller_wallet: BlockchainUtils.fromHex(
            event.result.seller,
            tronWebObject
          ),
          deal_status: ConstantMembers.DEAL_STATUS.ACCEPTED,
          isDealLinkActive: false,
        },
        {
          escrow_wallet: BlockchainUtils.fromHex(
            event.result.escrowWallet,
            tronWebObject
          ),
        }
      );
    }
  );

  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.RELEASE_FUND]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.RELEASE_FUND}" event:`,
          err
        );

      await TronQueries.updateDealDetails(
        {
          released_by: BlockchainUtils.fromHex(
            event.result.released_by,
            tronWebObject
          ),
          released_amount: event.result.amount_released.toString(),
          commission_amount: event.result.commission_amount.toString(),
          deal_status: ConstantMembers.DEAL_STATUS.RELEASED,
          release_tx_hash: event.transaction,
        },
        {
          escrow_wallet: BlockchainUtils.fromHex(
            event.result.escrowWallet,
            tronWebObject
          ),
        }
      );
    }
  );

  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.WITHDRAW]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.WITHDRAW}" event:`,
          err
        );

      await TronQueries.updateDealDetails(
        {
          released_by: BlockchainUtils.fromHex(
            event.result._buyer,
            tronWebObject
          ),
          released_amount: event.result.amount_withdrawn.toString(),
          commission_amount: event.result.commission_amount.toString(),
          deal_status: ConstantMembers.DEAL_STATUS.REFUNDED,
          release_tx_hash: event.transaction,
          isDealLinkActive: false,
        },
        {
          escrow_wallet: BlockchainUtils.fromHex(
            event.result.escrowWallet,
            tronWebObject
          ),
        }
      );
    }
  );

  tronContract[ConstantMembers.CONTRACT_EVENTS.TRON.SIX_MONTHS]().watch(
    async (err, event) => {
      if (err)
        return logger.error(
          `Error with "${ConstantMembers.CONTRACT_EVENTS.TRON.SIX_MONTHS}" event:`,
          err
        );

      await TronQueries.updateDealDetails(
        {
          released_by: event.result._destAddr,
          released_amount: event.result.amount_withdrawn.toString(),
          commission_amount: event.result.amount_withdrawn.toString(),
          deal_status: ConstantMembers.DEAL_STATUS.WITHDRAWN_BY_OWNER,
          release_tx_hash: event.transaction,
          isDealLinkActive: false,
        },
        { escrow_wallet: event.result.escrowWallet }
      );
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
