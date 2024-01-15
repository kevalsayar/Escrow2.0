import styles from "./Header.module.css";
import { useRef, useState } from "react";
import copyIcon from "../../assets/icons/copyIcon.png";
import { TOOLTIP_TIMER } from "../../utils/constants.utils";
import { Overlay, Tooltip } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import {
  copyToClipboard,
  displayWalletAddress,
} from "../../utils/helper.utils";
import { useNavigate } from "react-router-dom";
import { clientRoutes } from "../../utils/constants.utils";

const Header = ({ account, walletIcon }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(clientRoutes.newDeal);
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const copyRef = useRef();

  const copyAddress = () => {
    copyToClipboard(account);

    setShowTooltip(true);

    setTimeout(() => {
      setShowTooltip(false);
    }, TOOLTIP_TIMER);
  };

  return (
    <div className={styles.header}>
      <div className={styles.imgDiv}>
        <img src={walletIcon} className={styles.image} />
      </div>

      <span id="wallet-address" className={`${styles.walletInput} border`}>
        {displayWalletAddress(account, 10)}
      </span>

      <div className={styles.copyDiv} onClick={copyAddress} ref={copyRef}>
        <img src={copyIcon} className={styles.image} />
      </div>

      <Overlay target={copyRef.current} show={showTooltip} placement="right">
        {(props) => <Tooltip {...props}>Copied</Tooltip>}
      </Overlay>

      {location?.pathname !== "/new-deal" && (
        <div className={styles.buttonDiv}>
          <button className={styles.button} onClick={handleClick}>
            + CREATE NEW DEAL
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
