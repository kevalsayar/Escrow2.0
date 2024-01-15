import React, { useEffect, useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import metamaskIcon from "../../../assets/icons/metamaskIcon.png";
import { Form, Button, Spinner } from "react-bootstrap";
import styles from "./acceptDeal.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CONTRACT_FUNCTIONS,
  ROUTES,
  WEI,
  errorMessage,
  TOAST_RESPONSE,
  TOKEN,
  clientRoutes,
  STATUS_CODES,
  API_METHODS,
  NETWORK_CHAINS,
} from "../../../utils/constants.utils";
import sepoliaEscrowProxyAbi from "../../../contractAbi/sepolia/escrowChildContract.json";
import {
  sendSmartContract,
  weiFunctions,
  fetchAccounts,
  switchChain,
} from "../../../services/web3.services";
import { APIcall, toastMessage } from "../../../utils/helper.utils";
import { useAuth } from "../../../context/authContext";

const AcceptDeal = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [escrowAddress, setEscrowAddress] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const { user } = useAuth();

  const getDealData = async () => {
    try {
      const deal_id = searchParams.get("id");

      const acceptDealRes = await APIcall(
        API_METHODS.GET,
        ROUTES.SEPOLIADEALS.acceptDeal,
        {
          params: { deal_id: deal_id },
        }
      );

      if (acceptDealRes.code === STATUS_CODES.BAD_REQUEST) {
        navigate(clientRoutes.transactions);
        throw new Error(errorMessage.LINK_INACTIVE);
      }

      const getDealsRes = await APIcall(
        API_METHODS.GET,
        ROUTES.SEPOLIADEALS.getDeals,
        {
          params: { deal_id: deal_id },
        }
      );

      if (getDealsRes?.data.buyer_wallet === (await fetchAccounts())[0]) {
        setIsBuyer(true);
        setDisable(true);
        setLoading(true);
      }

      setTitle(getDealsRes?.data?.deal_title);
      setDescription(getDealsRes?.data?.deal_description);
      setAmount(
        weiFunctions(`${getDealsRes?.data?.escrow_amount}`, WEI.FROM_WEI)
      );
      setEscrowAddress(getDealsRes?.data?.escrow_wallet);
    } catch (error) {
      toastMessage(error.message, "error", TOAST_RESPONSE.ERROR);
    }
  };

  useEffect(() => {
    getDealData();
  }, []);

  const handleAccept = async () => {
    try {
      setLoading(true);

      await switchChain(NETWORK_CHAINS.SEPOLIA);

      const acceptDealRes = await sendSmartContract(
        CONTRACT_FUNCTIONS.SEPOLIA.ESCROW.ACCEPT_DEAL,
        [],
        [{ from: (await fetchAccounts())[0] }],
        sepoliaEscrowProxyAbi,
        escrowAddress
      );

      if (!acceptDealRes.status) throw new Error(errorMessage.TRANSACTION_FAIL);

      navigate(clientRoutes.transactions);
    } catch (error) {
      toastMessage(error.message, error.code, TOAST_RESPONSE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <SideBar />
      <Header account={user} walletIcon={metamaskIcon} />

      <div className={styles.newDeal}>
        <>
          <span className={styles.heading}>Accept Deal</span>
          <div className={`mt-3 ${styles.formDiv}`}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className={styles.label}>Title</Form.Label>
                <Form.Control
                  className={styles.customInput}
                  type="text"
                  name="title"
                  value={title}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className={styles.label}>Description</Form.Label>
                <Form.Control
                  className={styles.customInput}
                  type="text"
                  as="textarea"
                  rows={2}
                  name="description"
                  value={description}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className={styles.label}>
                  {`Amount(in ${TOKEN.USDT})`}
                </Form.Label>
                <Form.Control
                  className={styles.customInput}
                  type="number"
                  name="amount"
                  value={amount}
                  readOnly
                />
              </Form.Group>
              <div
                className={styles.btnDiv}
                style={{
                  justifyContent: isBuyer ? "space-around" : "space-between",
                }}
              >
                <Button
                  disabled={disable || loading}
                  className={styles.acceptBtn}
                  onClick={handleAccept}
                  style={{ width: isBuyer ? "90%" : "48%" }}
                >
                  {loading ? (
                    <>
                      {isBuyer && (
                        <span>Waiting for seller to accept the deal </span>
                      )}
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    "Accept"
                  )}
                </Button>
                {!isBuyer && (
                  <Button
                    disabled={disable || loading}
                    className={styles.declineBtn}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </>
      </div>
    </React.Fragment>
  );
};

export default AcceptDeal;
