import React from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/authContext";
import phantomIcon from "../../../assets/icons/phantomIcon.jpg";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <React.Fragment>
      <SideBar activeProp="Dashboard" />
      <Header account={user} walletIcon={phantomIcon} />
    </React.Fragment>
  );
};

export default Dashboard;
