import PageTwo from "../assets/images/PageTwo.svg";
import styles from "../views/Sepolia/NewDeal/newDeal.module.css";
import { Form, Button, Overlay, Tooltip } from "react-bootstrap";
import copyIcon from "../assets/icons/copyIcon.png";
import shareIcon from "../assets/icons/shareIcon.png";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { clientRoutes, TOOLTIP_TIMER } from "../utils/constants.utils";
import { copyToClipboard } from "../utils/helper.utils";

const DealSuccess = ({ dealLink }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const copiedRef = useRef();
  const navigate = useNavigate();
  const handleCopy = () => {
    copyToClipboard(dealLink);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, TOOLTIP_TIMER);
  };
  const handleClick = () => {
    navigate(clientRoutes.transactions);
  };
  const handleRedirection = () => {
    window.open(dealLink, "_blank");
  };

  return (
    <div className={`mt-3 ${styles.formDiv}`}>
      <div className={styles.image}>
        <img src={PageTwo} alt="img" className={styles.imageWidth} />
      </div>
      <div className={`mt-4 mb-4 ${styles.text}`}>
        Deal created successfully
      </div>
      <div className="mb-4">
        A unique deal URL(DURL) has been generated! Share it with your seller
        (Fund Recipient)
      </div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className={`${styles.label} ${styles.block}`}>
            URL
          </Form.Label>
          <div className="d-flex">
            <input
              className={`form-control ${styles.customInput} ${styles.inputWidth}`}
              type="text"
              name="url"
              placeholder={dealLink}
              readOnly
              onClick={handleRedirection}
            />
            <span
              className={`border ${styles.copySpan}`}
              onClick={handleCopy}
              ref={copiedRef}
            >
              <img src={copyIcon} alt="copy" className={styles.image} />
            </span>
            <Overlay
              target={copiedRef.current}
              show={showTooltip}
              placement="top"
            >
              {(props) => <Tooltip {...props}>Copied</Tooltip>}
            </Overlay>
            <span className={`border ${styles.copySpan}`}>
              <img src={shareIcon} alt="share" className={styles.image} />
            </span>
          </div>
        </Form.Group>
        <Button onClick={handleClick} className={`${styles.nextBtn} mt-3 mb-3`}>
          Finish
        </Button>
      </Form>
    </div>
  );
};

export default DealSuccess;
