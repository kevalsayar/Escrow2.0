import React, { useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Solana/Header";
import styles from "./newDeal.module.css";
import DealSuccess from "../../../components/DealSuccess";
import { Form, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageOne from "../../../assets/images/PageOne.svg";
import { API_METHODS, ROUTES, TOKEN } from "../../../utils/constants.utils";
import { useSolana } from "../../../context/solaServiceContext";
import { toSolana } from "../../../services/solana.services";
import { APIcall } from "../../../utils/helper.utils";

const NewDeal = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dealLink, setDealLink] = useState("");
  const [error, setError] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const { initializeDeal, depositSol, solanaAddr, newEscrowId } = useSolana();

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
      setDisableBtn(true);
      const amountInLamports = toSolana(values.amount);
      const newAmountInLamports = amountInLamports.toNumber();

      const body = {
        deal_title: values.title,
        deal_description: values.description,
        escrow_amount: newAmountInLamports,
        deal_token: TOKEN.SOL,
      };
      await APIcall(API_METHODS.POST, ROUTES.SOLDEALS.postDeal, body)
        .then(async function (mainResponse) {
          const deal_id = mainResponse?.data?.data?.deal_id;
          let id = await newEscrowId(deal_id);
          if (id) {
            id = id.toString();
            let bodyDealID = {
              deal_id: deal_id,
            };
            if (await initializeDeal(id, deal_id)) {
              await APIcall(
                API_METHODS.PATCH,
                ROUTES.SOLDEALS.setID,
                bodyDealID
              )
                .then(async function (response) {
                  if (await depositSol(deal_id, amountInLamports)) {
                    await APIcall(
                      API_METHODS.PATCH,
                      ROUTES.SOLDEALS.deposit,
                      bodyDealID
                    )
                      .then(function (response) {
                        setDealLink(mainResponse.data?.data?.deal_link);
                        setDisableBtn(false);
                        setIsSubmitted(true);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }
          setDisableBtn(false);
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
                    name="description"
                    as="textarea"
                    rows={2}
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
                    {`Amount(in ${TOKEN.SOL})`}
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
