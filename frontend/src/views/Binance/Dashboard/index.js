import React from "react";
import SideBar from "../../../components/Sidebar";
import Header from "../../../components/Binance/Header";

const Dashboard = () => {
  return (
    <React.Fragment>
      <SideBar activeProp="Dashboard" />
      <Header />
    </React.Fragment>
  );
};

export default Dashboard;
