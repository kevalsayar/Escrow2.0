import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import IDL from "../contractAbi/solana/idl.json";

export const RPCENDPOINT =
  "https://boldest-dark-panorama.solana-devnet.quiknode.pro/8c6dc52408463ffa89ddc6a5c19b9aafae7c5c7a/";
// const FACTORY_SEED = "factoryinitone";
const ESCROW_SEED = "escrowinitone";
const PROGRAM_ID = new PublicKey(
  "8pZkBXTmvLdudXm5R7JmtihPJ3C5anAd6N9EvGZzBJ3n"
);
const COMMISION_KEY = new PublicKey(
  "BpvinfQbUZ7HbxnLvFYGvWG1hgqHUL6gQP5REKi5LcJi"
);

const accountObj = { systemProgram: SystemProgram.programId };

export const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana;

    if (provider?.isPhantom) return provider;
  } else return false;
};

export const toSolana = (amount) => new BN(amount * LAMPORTS_PER_SOL);

export const fromLamport = (amount) => amount / LAMPORTS_PER_SOL;

export const getProgram = (connection, wallet) =>
  new Program(
    IDL,
    PROGRAM_ID,
    new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    })
  );

export const getProgramAccountPk = (seeds) =>
  PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)[0];

export const getEscrowIdPk = (id) =>
  getProgramAccountPk([ESCROW_SEED, new BN(id).toArrayLike(Buffer, "le", 8)]);

export const confirmTx = async (txHash, connection) => {
  const blockHashInfo = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: blockHashInfo.blockhash,
    lastValidBlockHeight: blockHashInfo.lastValidBlockHeight,
    signature: txHash,
  });
};

export const createInitDeal = (escrowAdress, wallet, escrowid) => {
  accountObj.escrow = escrowAdress;
  accountObj.payer = wallet?.publicKey;
  accountObj.escrowid = escrowid;
  return accountObj;
};

export const createNescrowId = (addr, wallet, factory) => {
  accountObj.escrowid = addr;
  accountObj.signer = wallet?.publicKey;
  accountObj.factory = factory;
  return accountObj;
};

export const createEscrowParties = (escrowAdress, wallet) => {
  accountObj.escrow = escrowAdress;
  accountObj.signer = wallet?.publicKey;
  return accountObj;
};

export const createReleaseFund = (escrowAdress, wallet, reciever) => {
  accountObj.escrow = escrowAdress;
  accountObj.signer = wallet?.publicKey;
  accountObj.reciever = reciever;
  accountObj.commisionAccount = COMMISION_KEY;
  return accountObj;
};

export const createWithdrawFund = (escrowAdress, wallet) => {
  accountObj.escrow = escrowAdress;
  accountObj.signer = wallet?.publicKey;
  accountObj.commisionAccount = COMMISION_KEY;
  return accountObj;
};

export const findReciever = (escrow, signer) => {
  let { owner: buyer, seller } = escrow;

  buyer = buyer.toString();
  seller = seller.toString();

  if (!buyer || !seller) return;

  return signer.toString() === buyer
    ? new PublicKey(seller)
    : new PublicKey(buyer);
};
