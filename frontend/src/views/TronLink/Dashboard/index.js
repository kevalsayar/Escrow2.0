import React from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/authContext";
import tronLinkIcon from "../../../assets/icons/tronLinkIcon.png";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <React.Fragment>
      <SideBar activeProp="Dashboard" />
      <Header account={user} walletIcon={tronLinkIcon} />
    </React.Fragment>
  );
};

export default Dashboard;
