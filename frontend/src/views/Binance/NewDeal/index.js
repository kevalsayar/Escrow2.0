import React, { useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Binance/Header";
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
  WEI,
  TOKEN,
  TOAST_RESPONSE,
  errorMessage,
  TOKEN_DETAILS,
  NETWORK_CHAINS,
  API_METHODS,
} from "../../../utils/constants.utils";
import escrowFactoryAbi from "../../../abi/bsc/escrowFactoryAbi.json";
import USDTabi from "../../../abi/bsc/usdtTokenAbi.json";
import {
  fetchAccounts,
  sendSmartContract,
  callSmartContract,
  weiFunctions,
  switchChain,
} from "../../../services/web3.services";
import { APIcall, toastMessage } from "../../../utils/helper.utils";

const NewDeal = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dealLink, setDealLink] = useState("");
  const [error, setError] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

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
      const account = (await fetchAccounts())[0];
      const amountInWei = weiFunctions(`${values.amount}`, WEI.TO_WEI);
      const body = {
        deal_title: values.title,
        deal_description: values.description,
        deal_token: TOKEN.USDT,
      };
      if (await switchChain(NETWORK_CHAINS.BINANCE_TEST_NETWORK)) {
        if (
          (await callSmartContract(
            CONTRACT_FUNCTIONS.USDT_TOKEN.BALANCE_OF,
            [account],
            USDTabi,
            TOKEN_DETAILS.BSC.USDT_TOKEN.TOKEN_ADDRESS
          )) >= amountInWei
        ) {
          setDisableBtn(true);
          await APIcall(API_METHODS.POST, ROUTES.BSCDEALS.postDeal, body)
            .then(async function (response) {
              if (
                (
                  await sendSmartContract(
                    CONTRACT_FUNCTIONS.USDT_TOKEN.APPROVE,
                    [CONTRACT_ADDRESSES.BSC.ESCROW_UPG_FACTORY, amountInWei],
                    [{ from: account }],
                    USDTabi,
                    TOKEN_DETAILS.BSC.USDT_TOKEN.TOKEN_ADDRESS
                  )
                )?.status
              ) {
                if (
                  (
                    await sendSmartContract(
                      CONTRACT_FUNCTIONS.BSC.FACTORY.CREATE_ESCROW,
                      [
                        response.data.data.deal_id,
                        TOKEN_DETAILS.BSC.USDT_TOKEN.TOKEN_ADDRESS,
                        amountInWei,
                      ],
                      [{ from: account }],
                      escrowFactoryAbi,
                      CONTRACT_ADDRESSES.BSC.ESCROW_UPG_FACTORY
                    )
                  )?.status
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
              console.log(error);
            });
        } else {
          toastMessage(
            errorMessage.INSUFFICIENT_FUNDS,
            "toast_insufficient_funds",
            TOAST_RESPONSE.ERROR
          );
        }
      }
    },
  });
  return (
    <React.Fragment>
      <SideBar activeProp="New Deal" />
      <Header />
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
