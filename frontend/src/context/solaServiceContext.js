import { useState, createContext, useContext, useEffect, useMemo } from "react";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getProgram,
  getFactoryAccountPk,
  getEscrowAccountPk,
  confirmTx,
  createInitDeal,
  createEscrowParties,
  createReleaseFund,
  findReciever,
  createWithdrawFund,
  createNescrowId,
  getEscrowIdPk,
  toSolana,
} from "../services/solana.services";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  TOAST_RESPONSE,
  errorMessage,
  successMessage,
} from "../utils/constants.utils";
import { toastMessage } from "../utils/helper.utils";

const SolanaContext = createContext(null);

export const SolanaContextProvider = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [factory, setFactory] = useState(null);
  const [factoryId, setFactoryId] = useState(undefined);
  const [solanaAddr, setSolanaAddr] = useState(null);

  const program = useMemo(() => {
    if (connection && wallet) {
      return getProgram(connection, wallet);
    }
  }, [connection, wallet]);

  useEffect(() => {
    if (connection && wallet) {
      if (!solanaAddr) setSolanaAddr(wallet.publicKey.toString());
    }
  }, [wallet]);

  const updateStates = async () => {
    if (program) {
      try {
        if (!factoryId) {
          let tm = getFactoryAccountPk();
          setFactory(tm);
          let { lastId } = await program.account.factory.fetch(tm);
          setFactoryId(lastId.toNumber());
        }
      } catch (error) {
        console.log("failed to update states", error);
      }
    }
  };

  const newEscrowId = async (uuid) => {
    if (!program) return;
    try {
      let { lastId } = await program.account.factory.fetch(factory);
      let fid = lastId.toNumber() + 1;
      const escrowAdress = getEscrowIdPk(fid);

      const txHash = await program.methods
        .newEscrowId(uuid)
        .accounts(createNescrowId(escrowAdress, wallet, factory))
        .rpc();
      await confirmTx(txHash, connection);
      toastMessage(
        successMessage.ESCROW_ID_CREATED,
        "toast_escrow_id_success",
        TOAST_RESPONSE.SUCCESS
      );
      return fid;
    } catch (error) {
      toastMessage(
        errorMessage.ESCROW_ID_FAILURE,
        "toast_escrow_id_failure",
        TOAST_RESPONSE.ERROR
      );
      return null;
    }
  };

  const initializeDeal = async (id, uuid) => {
    if (!program) return;
    try {
      const escrowIdAdress = getEscrowIdPk(id);
      const escrowAdress = getEscrowAccountPk(uuid);
      const txHash = await program.methods
        .initializeDeal()
        .accounts(createInitDeal(escrowAdress, wallet, escrowIdAdress))
        .rpc();
      await confirmTx(txHash, connection);
      toastMessage(
        successMessage.DEAL_INITIATED,
        "toast_init_success",
        TOAST_RESPONSE.SUCCESS
      );
      return true;
    } catch (error) {
      toastMessage(
        errorMessage.INIT_FAILURE,
        "toast_init_failure",
        TOAST_RESPONSE.ERROR
      );
      return null;
    }
  };

  const depositSol = async (uuid, amount) => {
    if (!program) return;
    try {
      const escrowAdress = getEscrowAccountPk(uuid);
      const txHash = await program.methods
        .deposit(amount)
        .accounts(createEscrowParties(escrowAdress, wallet))
        .rpc();
      await confirmTx(txHash, connection);
      toastMessage(
        successMessage.DEPOSIT_SUCCESS,
        "toast_deposit_success",
        TOAST_RESPONSE.SUCCESS
      );
      return true;
    } catch (error) {
      toastMessage(
        errorMessage.DEPOSIT_FAILURE,
        "toast_deposit_failure",
        TOAST_RESPONSE.ERROR
      );
      return false;
    }
  };

  const acceptDeal = async (uuid) => {
    if (!program) return;
    try {
      const escrowAdress = getEscrowAccountPk(uuid);
      const txHash = await program.methods
        .acceptDeal()
        .accounts(createEscrowParties(escrowAdress, wallet))
        .rpc();
      await confirmTx(txHash, connection);
      toastMessage(
        successMessage.ACCEPT_SUCCESS,
        "toast_accept_success",
        TOAST_RESPONSE.SUCCESS
      );
      return true;
    } catch (error) {
      toastMessage(
        errorMessage.ACCEPT_FAILURE,
        "toast_accept_failure",
        TOAST_RESPONSE.ERROR
      );
      return false;
    }
  };

  const releaseFund = async (uuid) => {
    if (!program) return;
    try {
      const escrowAdress = getEscrowAccountPk(uuid);
      const escrow = await program.account.escrow.fetch(escrowAdress);
      const reciever = findReciever(escrow, wallet.publicKey);

      const txHash = await program.methods
        .releaseFund()
        .accounts(createReleaseFund(escrowAdress, wallet, reciever))
        .rpc();
      await confirmTx(txHash, connection);
      toastMessage(
        successMessage.RELEASE_SUCCESS,
        "toast_release_success",
        TOAST_RESPONSE.SUCCESS
      );
      return true;
    } catch (error) {
      toastMessage(
        errorMessage.RELEASE_FAILURE,
        "toast_release_failure",
        TOAST_RESPONSE.ERROR
      );
      return false;
    }
  };

  const withdrawFund = async (uuid) => {
    if (!program) return;
    try {
      const escrowAdress = getEscrowAccountPk(uuid);

      const txHash = await program.methods
        .withdrawFund()
        .accounts(createWithdrawFund(escrowAdress, wallet))
        .rpc();
      await confirmTx(txHash, connection);
      toastMessage(
        successMessage.WITHDRAW_SUCCESS,
        "toast_withdraw_success",
        TOAST_RESPONSE.SUCCESS
      );
      return true;
    } catch (error) {
      toastMessage(
        errorMessage.WITHDRAW_FAILURE,
        "toast_withdraw_failure",
        TOAST_RESPONSE.ERROR
      );
      return false;
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
