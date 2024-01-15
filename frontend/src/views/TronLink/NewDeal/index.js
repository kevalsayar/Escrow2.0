import React, { useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/authContext";
import tronLinkIcon from "../../../assets/icons/tronLinkIcon.png";
import styles from "./newDeal.module.css";
import DealSuccess from "../../../components/DealSuccess";
import { Form, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageOne from "../../../assets/images/PageOne.svg";
import {
  CONTRACT_ADDRESSES,
  CONTRACT_FUNCTIONS,
  ROUTES,
  TOKEN,
  TOAST_RESPONSE,
  errorMessage,
  TOKEN_DETAILS,
  SUN,
  API_METHODS,
} from "../../../utils/constants.utils";
import escrowFactoryAbi from "../../../contractAbi/tron/escrowFactoryAbi.json";
import tronUSDTAbi from "../../../contractAbi/tron/usdtTokenAbi.json";
import { toastMessage, APIcall } from "../../../utils/helper.utils";
import {
  callSmartContract,
  connectToTron,
  sendSmartContract,
  sunFunctions,
} from "../../../services/tron.services";

const NewDeal = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dealLink, setDealLink] = useState("");
  const [error, setError] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      amount: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, "Title length must be at least 5 characters long")
        .required("Title is required"),
      description: Yup.string()
        .min(10, "Description length must be at least 10 characters long")
        .required("Description is required"),
      amount: Yup.number().required("USDT is required"),
    }),
    onSubmit: async (values) => {
      const account = await connectToTron();
      const amountInSun = sunFunctions(values.amount, SUN.TO_SUN);
      const body = {
        deal_title: values.title,
        deal_description: values.description,
        deal_token: TOKEN.USDT,
      };
      if (
        parseInt(amountInSun) <=
        parseInt(
          (
            await callSmartContract(
              CONTRACT_FUNCTIONS.USDT_TOKEN.BALANCE_OF,
              [account],
              tronUSDTAbi,
              TOKEN_DETAILS.TRON.USDT_TOKEN.TOKEN_ADDRESS
            )
          ).toString()
        )
      ) {
        setDisableBtn(true);
        await APIcall(API_METHODS.POST, ROUTES.TRONDEALS.postDeal, body)
          .then(async function (response) {
            if (
              await sendSmartContract(
                CONTRACT_FUNCTIONS.USDT_TOKEN.APPROVE,
                [CONTRACT_ADDRESSES.TRON.ESCROW_FACTORY, amountInSun],
                [
                  {
                    feeLimit: 10000000000,
                    callValue: 0,
                    shouldPollResponse: true,
                  },
                ],
                tronUSDTAbi,
                TOKEN_DETAILS.TRON.USDT_TOKEN.TOKEN_ADDRESS
              )
            ) {
              if (
                await sendSmartContract(
                  CONTRACT_FUNCTIONS.TRON.FACTORY.CREATE_ESCROW,
                  [
                    response.data.data.deal_id,
                    TOKEN_DETAILS.TRON.USDT_TOKEN.TOKEN_ADDRESS,
                    amountInSun,
                  ],
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
                setDealLink(response.data?.data?.deal_link);
                setDisableBtn(false);
                setIsSubmitted(true);
              } else {
                setDisableBtn(false);
                toastMessage(
                  errorMessage.TRANSACTION_FAIL,
                  "toast_transaction_fail",
                  TOAST_RESPONSE.ERROR
                );
              }
            } else {
              setDisableBtn(false);
              toastMessage(
                errorMessage.TRANSACTION_FAIL,
                "toast_transaction_fail",
                TOAST_RESPONSE.ERROR
              );
            }
          })
          .catch(function (error) {
            setDisableBtn(false);
            if (
              error?.response?.data?.message ===
              "Server encountered an unexpected condition that prevented it from fulfilling the request!"
            ) {
              setError("Insufficient Funds");
            } else {
              setError(error?.response?.data?.message);
            }
          });
      } else {
        toastMessage(
          errorMessage.INSUFFICIENT_FUNDS,
          "toast_insufficient_funds",
          TOAST_RESPONSE.ERROR
        );
      }
    },
  });
  return (
    <React.Fragment>
      <SideBar activeProp="New Deal" />
      <Header account={user} walletIcon={tronLinkIcon} />
      <div className={styles.newDeal}>
        {isSubmitted ? (
          <DealSuccess dealLink={dealLink} />
        ) : (
          <>
            <span className={styles.heading}>Create New Deal</span>
            <div className={`mt-3 ${styles.formDiv}`}>
              <div className={styles.image}>
                <img
                  alt="pageOne"
                  src={PageOne}
                  className={styles.imageWidth}
                />
              </div>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className={styles.label}>Title</Form.Label>
                  <Form.Control
                    className={styles.customInput}
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <p className={styles.error}>{formik.errors.title}</p>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className={styles.label}>Description</Form.Label>
                  <Form.Control
                    className={styles.customInput}
                    type="text"
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <p className={styles.error}>{formik.errors.description}</p>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className={styles.label}>
                    {`Amount(in ${TOKEN.USDT})`}
                  </Form.Label>
                  <Form.Control
                    className={styles.customInput}
                    type="number"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.amount && formik.errors.amount ? (
                    <p className={styles.error}>{formik.errors.amount}</p>
                  ) : error ? (
                    <p className={styles.error}>{error}</p>
                  ) : null}
                </Form.Group>
                <Button
                  className={styles.nextBtn}
                  disabled={disableBtn}
                  style={{
                    backgroundColor: disableBtn ? "grey !important" : "",
                  }}
                  type="submit"
                >
                  {disableBtn ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Next"
                  )}
                </Button>
              </Form>
            </div>
            {disableBtn && (
              <span className="mt-3 fs-6">
                Please don't refresh the page! The deal is being processed...
              </span>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default NewDeal;
