import { useConnect } from "../context/connectContext";
import { useSolana } from "../context/solaServiceContext";
import { useEffect } from "react";
import { fetchAccounts } from "../services/web3.services";
import { walletTypes } from "../utils/constants.utils";
import { useAuth } from "../context/authContext";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { connectToTron } from "../services/tron.services";

const Auth = () => {
  const location = useLocation();
  const pathName = location?.pathname + location?.search;
  const { user, login } = useAuth();
  const { solanaAddr } = useSolana();
  const { isConnectedTo } = useConnect();
  useEffect(() => {
    if (solanaAddr && isConnectedTo === walletTypes.phantom) {
      login(solanaAddr);
    } else if (isConnectedTo === walletTypes.metamask) {
      fetchAccounts().then((value) => {
        login(value[0]);
      });
    } else if (isConnectedTo === walletTypes.tronlink) {
      connectToTron().then((res) => {
        login(res);
      });
    }
  }, [isConnectedTo, login, solanaAddr]);
  if (user === undefined && isConnectedTo) return null;
  return user ? <Outlet /> : <Navigate to="/" state={{ path: pathName }} />;
};
export default Auth;
