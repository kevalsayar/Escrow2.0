import styles from "./transactions.module.css";
import { useEffect, useRef, useState } from "react";
import {
  BGCOLOR,
  CONTRACT_ADDRESSES,
  CONTRACT_FUNCTIONS,
  SUN,
  TOOLTIP_TIMER,
} from "../../../utils/constants.utils";
import escrowFactoryAbi from "../../../abi/tron/escrowFactoryAbi.json";
import { FiCopy } from "react-icons/fi";
import { Overlay, Tooltip, Button, Modal, Spinner } from "react-bootstrap";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  sendSmartContract,
  sunFunctions,
} from "../../../services/tron.services";
import {
  copyToClipboard,
  displayWalletAddress,
} from "../../../utils/helper.utils";

function CustomAccordion(props) {
  const [show, setShow] = useState(false);
  const [disableRelease, setDisableRelease] = useState(false);
  const [disableWithdraw, setDisableWithdraw] = useState(false);
  const [disableFund, setDisableFund] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const copyRef = useRef();
  const copyBuyerRef = useRef();
  const { obj, onClick, className, createdDeals = false, updateStatus } = props;
  const [amount, setamount] = useState(obj?.escrow_amount);
  const dealStatus = obj?.deal_status;
  const ref = useRef();

  useEffect(() => {
    const sunAmount = sunFunctions(amount, SUN.FROM_SUN);
    setamount(sunAmount);
  }, []);
  const formatDate = (dateString) => {
    let date = new Date(dateString);
    let now_utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );

    let toString = new Date(now_utc).toUTCString();
    return toString.split(" ").slice(1).join(" ");
  };

  const handleClick = () => {
    if (ref.current?.className?.includes("collapsed")) setShow(false);
    else setShow(true);
  };

  const handleWithdrawClick = async () => {
    setShowWithdrawModal(false);
    setDisableWithdraw(true);
    try {
      if (
        await sendSmartContract(
          CONTRACT_FUNCTIONS.TRON.FACTORY.WITHDRAW,
          [obj?.id],
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
        setDisableWithdraw(false);
        updateStatus();
      } else {
        setDisableWithdraw(false);
      }
    } catch (error) {
      console.log("Error with Withdraw Transaction:", error);
      setDisableWithdraw(false);
    }
  };

  const handleReleaseClick = async () => {
    setShowReleaseModal(false);
    setDisableRelease(true);
    try {
      if (
        await sendSmartContract(
          CONTRACT_FUNCTIONS.TRON.FACTORY.RELEASE,
          [obj?.id],
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
        setDisableRelease(false);
        updateStatus();
      } else {
        setDisableRelease(false);
      }
    } catch (error) {
      console.log("Error with Release Transaction:", error);
      setDisableRelease(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`accordion-item ${show ? className : ""}`}
    >
      <table className={`${styles.accordionTable} accordion-header`}>
        <tbody>
          <tr
            ref={ref}
            onClick={handleClick}
            className="border"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${obj.id}`}
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <td className="col-2">{obj?.deal_title}</td>
            <td className="col-3">{formatDate(obj?.createdAt)}</td>
            <td className="col-2">
              {amount}
              {` `}
              {obj?.deal_token}
            </td>
            <td className={`col-3`}>
              {createdDeals ? (
                obj?.seller_wallet ? (
                  <>
                    {displayWalletAddress(obj?.seller_wallet, 7) + " "}
                    <span
                      ref={copyRef}
                      onClick={() => {
                        copyToClipboard(obj?.seller_wallet);
                        setShowTooltip(true);
                        setTimeout(() => {
                          setShowTooltip(false);
                        }, TOOLTIP_TIMER);
                      }}
                    >
                      <FiCopy />
                    </span>
                    <Overlay
                      target={copyRef.current}
                      show={showTooltip}
                      placement="right"
                    >
                      {(props) => <Tooltip {...props}>Copied</Tooltip>}
                    </Overlay>
                  </>
                ) : (
                  "N/A"
                )
              ) : obj?.buyer_wallet ? (
                <>
                  {displayWalletAddress(obj?.buyer_wallet, 7) + " "}
                  <span
                    ref={copyBuyerRef}
                    onClick={() => {
                      copyToClipboard(obj?.buyer_wallet);
                      setShowTooltip(true);
                      setTimeout(() => {
                        setShowTooltip(false);
                      }, TOOLTIP_TIMER);
                    }}
                  >
                    <FiCopy />
                  </span>
                  <Overlay
                    target={copyBuyerRef.current}
                    show={showTooltip}
                    placement="right"
                  >
                    {(props) => <Tooltip {...props}>Copied</Tooltip>}
                  </Overlay>
                </>
              ) : (
                "N/A"
              )}
            </td>
            <td className="col-2">
              <Button
                className={`btn pt-1 pb-1 ${styles.btnSuccess}`}
                style={{ backgroundColor: BGCOLOR[dealStatus] }}
              >
                {dealStatus}
              </Button>
              <span className="float-end me-2 fs-5">
                {show && className ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        id={`collapse${obj.id}`}
        className="accordion-collapse collapse"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionFlushExample"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <table className="w-100">
            <tbody>
              <tr>
                {/* <td className={`col-3 ${styles.bodyTitle}`}>Date</td> */}
                <td className={`col-5 ${styles.bodyTitle}`}>DURL </td>
                <td className={`col-5 ${styles.bodyTitle}`}>Description</td>
              </tr>
              <tr>
                {/* <td className="col-3">{formatDate(obj?.createdAt)}</td> */}
                <td className="col-5">
                  <a
                    target="_blank"
                    className={styles.link}
                    href={obj?.deal_link}
                  >
                    {obj?.deal_link}
                  </a>
                </td>
                <td className="col-5">{obj?.deal_description}</td>
                <td className="col-2" rowSpan={2}>
                  {dealStatus === "ACCEPTED" ? (
                    <span
                      style={{
                        cursor: disableRelease ? "no-drop" : "pointer",
                      }}
                    >
                      <Button
                        className={`btn ${styles.btnRelease}`}
                        disabled={disableRelease}
                        onClick={() => setShowReleaseModal(true)}
                      >
                        {createdDeals ? "Release " : "Refund "}
                        {disableRelease && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </span>
                  ) : dealStatus === "FUNDED" ? (
                    <span
                      style={{
                        cursor: disableWithdraw ? "no-drop" : "pointer",
                      }}
                    >
                      <Button
                        className={`btn ${styles.btnWithdraw}`}
                        disabled={disableWithdraw}
                        onClick={() => setShowWithdrawModal(true)}
                      >
                        {"Withdraw "}
                        {disableWithdraw && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </span>
                  ) : dealStatus === "INIT" ? (
                    <span
                      style={{
                        cursor: disableFund ? "no-drop" : "pointer",
                      }}
                    >
                      <Button
                        className={`btn ${styles.btnFunded}`}
                        disabled={disableFund}
                      >
                        {"Fund "}
                        {disableFund && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </span>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <Modal
            show={showReleaseModal}
            onHide={() => setShowReleaseModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Release of Funds</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Do you proceed with confirming the same, the{" "}
                {createdDeals ? "seller" : "buyer"} will be receiving the funds
                minus a small service fee.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowReleaseModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleReleaseClick}>
                Proceed
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showWithdrawModal}
            onHide={() => setShowWithdrawModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Withdraw of Funds</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Do you proceed with confirming the same, you will be receiving
                your funds back minus a small service fee.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowWithdrawModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleWithdrawClick}>
                Proceed
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default CustomAccordion;
