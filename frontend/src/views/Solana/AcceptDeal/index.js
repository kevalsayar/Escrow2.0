import React, { useEffect, useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/authContext";
import phantomIcon from "../../../assets/icons/phantomIcon.jpg";
import { Form, Button, Spinner } from "react-bootstrap";
import styles from "./acceptDeal.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ROUTES,
  errorMessage,
  TOAST_RESPONSE,
  clientRoutes,
  STATUS_CODES,
  API_METHODS,
} from "../../../utils/constants.utils";
import { toastMessage, APIcall } from "../../../utils/helper.utils";
import { useSolana } from "../../../context/solaServiceContext";
import { fromLamport } from "../../../services/solana.services";

const AcceptDeal = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const { solanaAddr, acceptDeal } = useSolana();
  const { user } = useAuth();

  const deal_id = searchParams.get("id");
  const dealIdObj = { deal_id: deal_id };

  useEffect(() => {
    getDealData();
  }, [solanaAddr]);

  const getDealData = async () => {
    try {
      const acceptDealRes = await APIcall(
        API_METHODS.GET,
        ROUTES.SOLDEALS.acceptDeal,
        {
          params: dealIdObj,
        }
      );

      if (acceptDealRes.code === STATUS_CODES.BAD_REQUEST) {
        navigate(clientRoutes.transactions);
        throw new Error(errorMessage.LINK_INACTIVE);
      }

      const getDealsRes = await APIcall(
        API_METHODS.GET,
        ROUTES.SOLDEALS.getDeals,
        {
          params: dealIdObj,
        }
      );

      const amountInEther = fromLamport(getDealsRes?.data?.escrow_amount);

      if (solanaAddr === getDealsRes?.data.buyer_wallet) {
        setIsBuyer(true);
        setDisable(true);
        setLoading(true);
      }

      setTitle(getDealsRes?.data?.deal_title);
      setDescription(getDealsRes?.data?.deal_description);
      setAmount(amountInEther);
    } catch (error) {
      toastMessage(error.message, "error", TOAST_RESPONSE.ERROR);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);

      if (!solanaAddr) throw new Error(errorMessage.INSTALL_PHANTOM);

      await acceptDeal(deal_id);

      const acceptDealRes = await APIcall(
        API_METHODS.PATCH,
        ROUTES.SOLDEALS.acceptDealSolana,
        dealIdObj
      );

      if (!acceptDealRes.status) throw new Error(acceptDealRes.message);

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
      <Header account={user} walletIcon={phantomIcon} />
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
                <Form.Label className={styles.label}>Amount(in SOL)</Form.Label>
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
                  style={{ width: isBuyer ? "90%" : "48%" }}
                  onClick={handleAccept}
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
