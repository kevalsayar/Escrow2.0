import React, { useEffect, useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Solana/Header";
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

  useEffect(() => {
    getDealData();
  }, [solanaAddr]);

  const getDealData = async () => {
    const deal_id = searchParams.get("id");
    await APIcall(API_METHODS.GET, ROUTES.SOLDEALS.acceptDeal, {
      params: { deal_id: deal_id },
    })
      .then(async function (response) {
        if (response?.data?.code === STATUS_CODES.SUCCESS) {
          await APIcall(API_METHODS.GET, ROUTES.SOLDEALS.getDeals, {
            params: { deal_id: deal_id },
          })
            .then(async function (response) {
              const amountInEther = fromLamport(
                response?.data?.data[0]?.escrow_amount
              );

              if (solanaAddr === response?.data?.data[0].buyer_wallet) {
                setIsBuyer(true);
                setDisable(true);
                setLoading(true);
              }
              setTitle(response?.data?.data[0]?.deal_title);
              setDescription(response?.data?.data[0]?.deal_description);
              setAmount(amountInEther);
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
    const deal_id = searchParams.get("id");
    if (solanaAddr) {
      let result = await acceptDeal(deal_id);
      if (result) {
        let bodyDealID = {
          deal_id: deal_id,
        };
        await APIcall(
          API_METHODS.PATCH,
          ROUTES.SOLDEALS.acceptDealSolana,
          bodyDealID
        )
          .then(function (response) {
            setLoading(false);
            navigate(clientRoutes.transactions);
          })
          .catch(function (error) {
            setLoading(false);
          });
      }
      setLoading(false);
    } else {
      setLoading(false);
      toastMessage(
        errorMessage.INSTALL_METAMASK,
        "toast_install",
        TOAST_RESPONSE.ERROR
      );
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
