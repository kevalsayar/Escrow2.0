import styles from "./Header.module.css";
import tronLinkIcon from "../../../assets/icons/tronLinkIcon.png";
import copyIcon from "../../../assets/icons/copyIcon.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { Overlay, Tooltip } from "react-bootstrap";
import { connectToTron } from "../../../services/tron.services";
import {
  copyToClipboard,
  displayWalletAddress,
} from "../../../utils/helper.utils";
import { TOOLTIP_TIMER } from "../../../utils/constants.utils";

const Header = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [account, setAccount] = useState("");
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
    navigate("/new-deal");
  };

  useEffect(() => {
    connectToTron().then((res) => {
      setAccount(res);
      login(res);
    });
  }, [user]);
  return (
    <div className={styles.header}>
      <div className={styles.imgDiv}>
        <img src={tronLinkIcon} className={styles.image} />
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
