const { provider } = require("../config/blockchain/sol.config");
const { HelperFunction } = require("./helpers");
const { PublicKey } = require("@solana/web3.js");
const IDL = require("../../contracts/solana/idl/idl.json");
const { SOLANA_PROGRAM_ID } = require("../config/env");

const SolanaHandlers = function () {
  const getAccountData = async (account) => {
    const program = HelperFunction.initializeProgram(
      IDL,
      new PublicKey(SOLANA_PROGRAM_ID),
      provider
    );
    return await program.account.escrow.fetch(account);
  };

  const getProgramAccountPk = (seeds) => {
    return PublicKey.findProgramAddressSync(
      seeds,
      new PublicKey(SOLANA_PROGRAM_ID)
    )[0];
  };

  const getEscrowAccountPk = (uuid) => {
    return getProgramAccountPk([uuid]);
  };

  const getDepositAddress = async (id) => {
    const account = getEscrowAccountPk(id);
    let data = await getAccountData(account);
    const { owner } = data;
    return owner.toString();
  };

  const getSellerAdddress = async (id) => {
    const account = getEscrowAccountPk(id);
    let data = await getAccountData(account);
    const { seller } = data;
    return seller.toString();
  };

  const getMinEscrowAmount = async (id) => {
    const account = getEscrowAccountPk(id);
    let data = await getAccountData(account);
    const { minimumescrowAmount } = data;
    return minimumescrowAmount.toString();
  };

  const getCommissionRate = async (id) => {
    const account = getEscrowAccountPk(id);
    let data = await getAccountData(account);
    const { commissionrate } = data;
    return commissionrate.toString();
  };

  const getReleasedBy = async (id) => {
    const account = getEscrowAccountPk(id);
    let data = await getAccountData(account);
    const { realesedBy } = data;
    return realesedBy.toString();
  };

  const getCommissionAmount = async (id) => {
    const account = getEscrowAccountPk(id);
    let data = await getAccountData(account);
    const { commissionAmount } = data;
    return commissionAmount.toString();
  };

  const getReleasedAmount = async (id) => {
    const account = getEscrowAccountPk(id);
    let data = await getAccountData(account);
    const { releasedAmount } = data;
    return releasedAmount.toString();
  };

  const getEscrowAddress = (id) => {
    const account = getEscrowAccountPk(id);
    return account.toString();
  };

  return {
    getAccountData,
    getProgramAccountPk,
    getEscrowAccountPk,
    getDepositAddress,
    getSellerAdddress,
    getMinEscrowAmount,
    getCommissionRate,
    getReleasedBy,
    getCommissionAmount,
    getReleasedAmount,
    getEscrowAddress,
  };
};

module.exports = { SolanaHandlers: SolanaHandlers() };
