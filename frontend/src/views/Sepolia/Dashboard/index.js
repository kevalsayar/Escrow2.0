import React from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/authContext";
import metamaskIcon from "../../../assets/icons/metamaskIcon.png";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <React.Fragment>
      <SideBar activeProp="Dashboard" />
      <Header account={user} walletIcon={metamaskIcon} />
    </React.Fragment>
  );
};

export default Dashboard;
