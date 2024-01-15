import { useState, createContext, useContext, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getProgram,
  confirmTx,
  createInitDeal,
  createEscrowParties,
  createReleaseFund,
  findReciever,
  createWithdrawFund,
  createNescrowId,
  getEscrowIdPk,
  getProgramAccountPk,
} from "../services/solana.services";
import { CONTRACT_FUNCTIONS, errorMessage } from "../utils/constants.utils";

const SolanaContext = createContext(null);

export const SolanaContextProvider = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [factory, setFactory] = useState(null);
  const [factoryId, setFactoryId] = useState(undefined);
  const [solanaAddr, setSolanaAddr] = useState(null);
  const FACTORY_SEED = "factoryinitone";

  const program = useMemo(() => {
    if (connection && wallet) return getProgram(connection, wallet);
  }, [connection, wallet]);

  useEffect(() => {
    if (connection && wallet)
      if (!solanaAddr) setSolanaAddr(wallet.publicKey.toString());
  }, [wallet]);

  const updateStates = async () => {
    try {
      if (checkProgramExistence())
        if (!factoryId) {
          let tm = getProgramAccountPk([FACTORY_SEED]);
          setFactory(tm);

          let { lastId } = await program.account.factory.fetch(tm);
          setFactoryId(lastId.toNumber());
        }
    } catch (error) {
      console.log("failed to update states", error);
    }
  };

  const executeTransaction = async (
    instructionName,
    instructionArgs,
    accounts
  ) => {
    try {
      const txHash = await program.methods[instructionName](...instructionArgs)
        .accounts(accounts)
        .rpc();

      await confirmTx(txHash, connection);

      return txHash;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const checkProgramExistence = () => {
    if (!program) throw new Error(errorMessage.SOLANA_PROGRAM_ERROR);
    return true;
  };

  const newEscrowId = async (uuid) => {
    checkProgramExistence();

    try {
      let { lastId } = await program.account.factory.fetch(factory);
      let fid = lastId.toNumber() + 1;

      await executeTransaction(
        CONTRACT_FUNCTIONS.SOL.CREATE_ESCROW,
        [uuid],
        createNescrowId(getEscrowIdPk(fid), wallet, factory)
      );

      return fid;
    } catch (error) {
      throw new Error(errorMessage.ESCROW_ID_FAILURE);
    }
  };

  const initializeDeal = async (id, uuid) => {
    checkProgramExistence();

    try {
      await executeTransaction(
        CONTRACT_FUNCTIONS.SOL.INITIALIZE_DEAL,
        [],
        createInitDeal(getProgramAccountPk([uuid]), wallet, getEscrowIdPk(id))
      );

      return true;
    } catch (error) {
      throw new Error(errorMessage.INIT_FAILURE);
    }
  };

  const depositSol = async (uuid, amount) => {
    checkProgramExistence();

    try {
      return await executeTransaction(
        CONTRACT_FUNCTIONS.SOL.DEPOSIT_FUNDS,
        [amount],
        createEscrowParties(getProgramAccountPk([uuid]), wallet)
      );
    } catch (error) {
      throw new Error(errorMessage.DEPOSIT_FAILURE);
    }
  };

  const acceptDeal = async (uuid) => {
    checkProgramExistence();

    try {
      await executeTransaction(
        CONTRACT_FUNCTIONS.SOL.ACCEPT_DEAL,
        [],
        createEscrowParties(getProgramAccountPk([uuid]), wallet)
      );

      return true;
    } catch (error) {
      throw new Error(errorMessage.ACCEPT_FAILURE);
    }
  };

  const releaseFund = async (uuid) => {
    checkProgramExistence();

    try {
      const escrowAdress = getProgramAccountPk([uuid]);
      const escrow = await program.account.escrow.fetch(escrowAdress);
      const reciever = findReciever(escrow, wallet.publicKey);

      return await executeTransaction(
        CONTRACT_FUNCTIONS.SOL.RELEASE_FUND,
        [],
        createReleaseFund(escrowAdress, wallet, reciever)
      );
    } catch (error) {
      throw new Error(errorMessage.RELEASE_FAILURE);
    }
  };

  const withdrawFund = async (uuid) => {
    checkProgramExistence();

    try {
      return await executeTransaction(
        CONTRACT_FUNCTIONS.SOL.WITHDRAW_FUND,
        [],
        createWithdrawFund(getProgramAccountPk([uuid]), wallet)
      );
    } catch (error) {
      throw new Error(errorMessage.WITHDRAW_FAILURE);
    }
  };

  useEffect(() => {
    updateStates();
  }, [program]);

  return (
    <SolanaContext.Provider
      value={{
        setSolanaAddr: setSolanaAddr,
        solanaAddr: solanaAddr,
        newEscrowId,
        initializeDeal,
        depositSol,
        acceptDeal,
        releaseFund,
        withdrawFund,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  return useContext(SolanaContext);
};
