import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import TransactionsMeta from "./views/Binance/Transactions";
import TransactionsPhantom from "./views/Solana/Transactions";
import TransactionsTron from "./views/TronLink/Transactions";
import Dashboard from "./views/Binance/Dashboard";
import DashboardPhantom from "./views/Solana/Dashboard";
import DashboardTron from "./views/TronLink/Dashboard";
import NewDeal from "./views/Binance/NewDeal";
import NewDealPhantom from "./views/Solana/NewDeal";
import NewDealTron from "./views/TronLink/NewDeal";
import AcceptDeal from "./views/Binance/AcceptDeal";
import AcceptDealPhantom from "./views/Solana/AcceptDeal";
import AcceptDealTron from "./views/TronLink/AcceptDeal";
import Auth from "./middleware/auth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/authContext";
import { useEffect } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useConnect } from "./context/connectContext";
import { walletTypes } from "./utils/constants.utils";
import { getProvider } from "./services/solana.services";
import { useSolana } from "./context/solaServiceContext";

function App() {
  const { user, logout, login } = useAuth();
  const { connect, isConnectedTo } = useConnect();
  const { setSolanaAddr, solanaAddr } = useSolana();
  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        logout();
      } else {
        connect(walletTypes.metamask);
        login(accounts[0]);
      }
    };
    if (isConnectedTo === walletTypes.metamask) {
      window?.ethereum?.on("accountsChanged", handleAccountsChanged);
      window?.ethereum?.on("disconnect", logout);
    } else if (isConnectedTo === walletTypes.tronlink) {
      window?.addEventListener("message", function (e) {
        if (e.data.message && e.data.message.action == "disconnect") {
          logout();
        }
        if (e.data.message && e.data.message.action == "setAccount") {
          login(e.data.message.data.address);
        }
      });
    } else if (solanaAddr && isConnectedTo === walletTypes.phantom) {
      const provider = getProvider();
      provider?.on("disconnect", () => {
        logout();
      });
      provider?.on("accountChanged", (publicKey) => {
        if (publicKey) {
          setSolanaAddr(publicKey.toBase58());
        } else {
          provider.connect().catch((error) => {
            console.log(error);
          });
        }
      });
    }
    return () => {
      if (isConnectedTo === walletTypes.metamask) {
        window?.ethereum?.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window?.ethereum?.removeListener("disconnect", logout);
      } else if (solanaAddr && isConnectedTo === walletTypes.phantom) {
        const provider = getProvider();
        provider?.removeListener("disconnect", logout);
        provider?.removeListener("accountChanged", (publicKey) => {
          if (publicKey) {
            setSolanaAddr(publicKey.toBase58());
          } else {
            provider.connect().catch((error) => {
              console.log(error);
            });
          }
        });
      }
    };
  }, [user, logout, isConnectedTo, connect]);
  return (
    <div className="App">
      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        limit={3}
        autoClose={2000}
      />
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route element={<Auth />}>
          <Route
            path="/dashboard"
            element={
              isConnectedTo === walletTypes.metamask ? (
                <Dashboard />
              ) : isConnectedTo === walletTypes.phantom ? (
                <DashboardPhantom />
              ) : (
                <DashboardTron />
              )
            }
          />
        </Route>
        <Route element={<Auth />}>
          <Route
            path="/transactions"
            element={
              isConnectedTo === walletTypes.metamask ? (
                <TransactionsMeta />
              ) : isConnectedTo === walletTypes.phantom ? (
                <TransactionsPhantom />
              ) : (
                <TransactionsTron />
              )
            }
          />
        </Route>
        <Route element={<Auth />}>
          <Route
            path="/new-deal"
            exact
            element={
              isConnectedTo === walletTypes.metamask ? (
                <NewDeal />
              ) : isConnectedTo === walletTypes.phantom ? (
                <NewDealPhantom />
              ) : (
                <NewDealTron />
              )
            }
          />
        </Route>
        <Route element={<Auth />}>
          <Route
            path="/accept"
            element={
              isConnectedTo === walletTypes.metamask ? (
                <AcceptDeal />
              ) : isConnectedTo === walletTypes.phantom ? (
                <AcceptDealPhantom />
              ) : (
                <AcceptDealTron />
              )
            }
          />
        </Route>
        {/* <Route path="*" element={<Auth />} /> */}
      </Routes>
    </div>
  );
}
export default App;
