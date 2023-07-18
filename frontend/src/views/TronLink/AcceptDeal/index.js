import React, { useEffect, useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/TronLink/Header";
import { Form, Button, Spinner } from "react-bootstrap";
import styles from "./acceptDeal.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CONTRACT_FUNCTIONS,
  ROUTES,
  errorMessage,
  TOAST_RESPONSE,
  TOKEN,
  SUN,
  CONTRACT_ADDRESSES,
  clientRoutes,
  STATUS_CODES,
  API_METHODS,
} from "../../../utils/constants.utils";
import escrowFactoryAbi from "../../../abi/tron/escrowFactoryAbi.json";
import { toastMessage, APIcall } from "../../../utils/helper.utils";
import {
  connectToTron,
  sendSmartContract,
  sunFunctions,
} from "../../../services/tron.services";

const AcceptDeal = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dealId, setDealId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [escrowAddress, setEscrowAddress] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  useEffect(() => {
    getDealData();
  }, []);

  const getDealData = async () => {
    const deal_id = searchParams.get("id");
    await APIcall(API_METHODS.GET, ROUTES.TRONDEALS.acceptDeal, {
      params: { deal_id: deal_id },
    })
      .then(async function (response) {
        if (response?.data?.code == STATUS_CODES.SUCCESS) {
          await APIcall(API_METHODS.GET, ROUTES.TRONDEALS.getDeals, {
            params: { deal_id: deal_id },
          })
            .then(async function (response) {
              const amountInTrx = sunFunctions(
                response?.data?.data[0]?.escrow_amount,
                SUN.FROM_SUN
              );
              const account = await connectToTron();
              if (response?.data?.data[0].buyer_wallet === account) {
                setIsBuyer(true);
                setDisable(true);
                setLoading(true);
              }
              setDealId(response?.data?.data[0]?.id);
              setTitle(response?.data?.data[0]?.deal_title);
              setDescription(response?.data?.data[0]?.deal_description);
              setAmount(amountInTrx);
              setEscrowAddress(response?.data?.data[0]?.escrow_wallet);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        if (error?.response?.status === STATUS_CODES.BAD_REQUEST) {
          toastMessage(
            errorMessage.LINK_INACTIVE,
            "toast_link_inactive",
            TOAST_RESPONSE.ERROR
          );
          navigate(clientRoutes.transactions);
        }
      });
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      if (
        await sendSmartContract(
          CONTRACT_FUNCTIONS.TRON.FACTORY.ACCEPT,
          [dealId],
          [
            {
              feeLimit: 10000000000,
              callValue: 0,
              shouldPollResponse: true,
            },
          ],
          escrowFactoryAbi,
          CONTRACT_ADDRESSES.TRON.ESCROW_FACTORY
        )
      ) {
        setLoading(false);
        navigate(clientRoutes.transactions);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <SideBar />
      <Header />
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
