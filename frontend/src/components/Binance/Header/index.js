import styles from "./Header.module.css";
import metamaskIcon from "../../../assets/icons/metamaskIcon.png";
import copyIcon from "../../../assets/icons/copyIcon.png";
import { fetchAccounts } from "../../../services/web3.services";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { Overlay, Tooltip } from "react-bootstrap";
import {
  displayWalletAddress,
  copyToClipboard,
} from "../../../utils/helper.utils";
import { clientRoutes, TOOLTIP_TIMER } from "../../../utils/constants.utils";

const Header = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const copyRef = useRef();
  const { user, login } = useAuth();
  const copyAddress = () => {
    copyToClipboard(user);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, TOOLTIP_TIMER);
  };
  const handleClick = () => {
    navigate(clientRoutes.newDeal);
  };

  useEffect(() => {
    fetchAccounts().then((value) => {
      login(value[0]);
    });
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.imgDiv}>
        <img src={metamaskIcon} className={styles.image} />
      </div>
      <span id="wallet-address" className={`${styles.walletInput} border`}>
        {displayWalletAddress(user, 10)}
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
