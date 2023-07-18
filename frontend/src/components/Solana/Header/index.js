import styles from "./Header.module.css";
import phantomIcon from "../../../assets/icons/phantomIcon.jpg";
import copyIcon from "../../../assets/icons/copyIcon.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/authContext";
import { useSolana } from "../../../context/solaServiceContext";
import { Overlay, Tooltip } from "react-bootstrap";
import {
  copyToClipboard,
  displayWalletAddress,
} from "../../../utils/helper.utils";
import { clientRoutes, TOOLTIP_TIMER } from "../../../utils/constants.utils";

const Header = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  //make sure to fix
  const [account, setAccount] = useState("");
  const { solanaAddr } = useSolana();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const copyRef = useRef();
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
  // const getAccount = async () => {
  //   const account = await fetchAccounts();
  //   setAccount(account[0]);
  // };

  const getAccount = async () => {
    setAccount(solanaAddr);
  };
  useEffect(() => {
    if (solanaAddr) {
      getAccount();
      login(solanaAddr);
    }
  }, [solanaAddr]);
  return (
    <div className={styles.header}>
      <div className={styles.imgDiv}>
        <img src={phantomIcon} className={styles.image} />
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
