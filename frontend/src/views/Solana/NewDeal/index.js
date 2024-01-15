import React, { useState } from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/authContext";
import phantomIcon from "../../../assets/icons/phantomIcon.jpg";
import styles from "./newDeal.module.css";
import DealSuccess from "../../../components/DealSuccess";
import { Form, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageOne from "../../../assets/images/PageOne.svg";
import {
  API_METHODS,
  ROUTES,
  TOKEN,
  TOAST_RESPONSE,
} from "../../../utils/constants.utils";
import { useSolana } from "../../../context/solaServiceContext";
import { toSolana } from "../../../services/solana.services";
import { APIcall, toastMessage } from "../../../utils/helper.utils";

const NewDeal = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dealLink, setDealLink] = useState("");
  const [error, setError] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const { initializeDeal, depositSol, solanaAddr, newEscrowId } = useSolana();
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
      try {
        setDisableBtn(true);

        const escrowAmtLamportsBN = toSolana(values.amount);
        const body = {
          deal_title: values.title,
          deal_description: values.description,
          deal_token: TOKEN.SOL,
          escrow_amount: escrowAmtLamportsBN.toNumber(),
        };

        const createDealRes = await APIcall(
          API_METHODS.POST,
          ROUTES.SOLDEALS.postDeal,
          body
        );

        const deal_id = createDealRes.data?.deal_id;
        const bodyDealID = {
          deal_id: deal_id,
        };

        const id = await newEscrowId(deal_id);

        await initializeDeal(id.toString(), deal_id);

        const setIdRes = await APIcall(
          API_METHODS.PATCH,
          ROUTES.SOLDEALS.setID,
          bodyDealID
        );

        bodyDealID.txHash = await depositSol(deal_id, escrowAmtLamportsBN);

        const depositRes = await APIcall(
          API_METHODS.PATCH,
          ROUTES.SOLDEALS.deposit,
          bodyDealID
        );

        setDealLink(createDealRes.data?.deal_link);
        setIsSubmitted(true);
      } catch (error) {
        toastMessage(error.message, error.name, TOAST_RESPONSE.ERROR);
      } finally {
        setDisableBtn(false);
      }
    },
  });

  return (
    <React.Fragment>
      <SideBar activeProp="New Deal" />
      <Header account={user} walletIcon={phantomIcon} />
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
