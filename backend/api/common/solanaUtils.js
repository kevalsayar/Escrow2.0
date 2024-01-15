const { provider } = require("../config/blockchain/sol.config"),
  { PublicKey } = require("@solana/web3.js"),
  IDL = require("../../contracts/solana/idl/idl.json"),
  { SOLANA_PROGRAM_ID } = require("../config/env"),
  { BlockchainUtils } = require("./blockchainUtils");

const SolanaHandlers = (() => {
  const getAccountData = async (id) =>
    await BlockchainUtils.initializeSolanaProgram(
      IDL,
      new PublicKey(SOLANA_PROGRAM_ID),
      provider
    ).account.escrow.fetch(getProgramAccountPk([id]));

  const getProgramAccountPk = (seeds) =>
    PublicKey.findProgramAddressSync(
      seeds,
      new PublicKey(SOLANA_PROGRAM_ID)
    )[0];

  const getEscrowAddress = (id) => getProgramAccountPk([id]).toString();

  return {
    getAccountData,
    getEscrowAddress,
  };
})();

module.exports = { SolanaHandlers };
