import styles from "./Sidebar.module.css";
import EscrowLogo from "../../assets/images/escrowproject-logo.webp";
import DashboardIcon from "../../assets/icons/dashboardIcon.png";
import NewDealIcon from "../../assets/icons/newDealIcon.png";
import dashboardIconActive from "../../assets/icons/dashboardIconActive.png";
import newDealIconActive from "../../assets/icons/newDealIconActive.png";
import LogoutIcon from "../../assets/icons/LogoutIcon.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { clientRoutes } from "../../utils/constants.utils";

const SideBar = ({ activeProp }) => {
  const [activeState, setActiveState] = useState(activeProp ? activeProp : "");
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (activeState === "New Deal") {
      navigate(clientRoutes.newDeal);
    } else if (activeState === "Transactions") {
      navigate(clientRoutes.transactions);
    } else if (activeState === "Dashboard") {
      navigate(clientRoutes.dashboard);
    }
  }, [activeState]);
  const handleClick = (text) => {
    setActiveState(text);
  };
  const Navigation = ({ img, text, active, activeImg }) => {
    let activeClass = active ? styles.active : "";
    let activeText = active ? styles.activeText : "";
    return (
      <div
        className={`${styles.navbar} ${activeClass}`}
        onClick={() => handleClick(text)}
      >
        <img src={active ? activeImg : img} />
        <span className={`${activeText} ${styles.text}`}>{text}</span>
      </div>
    );
  };
  return (
    <div className={styles.sidebar}>
      <img src={EscrowLogo} className={styles.escrowLogo} />
      <div className={styles.list}>
        <Navigation
          text="Dashboard"
          img={DashboardIcon}
          active={activeState === "Dashboard" ? true : false}
          activeImg={dashboardIconActive}
        />
        <Navigation
          text="Transactions"
          img={DashboardIcon}
          active={activeState === "Transactions" ? true : false}
          activeImg={dashboardIconActive}
        />
        <Navigation
          text="New Deal"
          img={NewDealIcon}
          active={activeState === "New Deal" ? true : false}
          activeImg={newDealIconActive}
        />
      </div>
      <div className={styles.bottom}></div>
      <div className={styles.bottomLogout}></div>
      <div className={styles.logout} onClick={() => logout()}>
        <img src={LogoutIcon} />
        <span className={styles.text}>Logout</span>
      </div>
    </div>
  );
};
export default SideBar;
