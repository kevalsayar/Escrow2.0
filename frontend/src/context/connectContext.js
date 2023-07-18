import { useState, createContext, useContext } from "react";
const ConnectContext = createContext(null);
export const ConnectProvider = ({ children }) => {
  const serialize = JSON.stringify;
  const deserialize = JSON.parse;
  const storedIsConnectedTo = deserialize(
    localStorage.getItem("isConnectedTo")
  );
  const [isConnectedTo, setIsConnectedTo] = useState(
    () => storedIsConnectedTo ?? ""
  );
  const connect = (walletType) => {
    localStorage.setItem("isConnectedTo", serialize(walletType));
    setIsConnectedTo(walletType);
  };
  const disconnect = () => {
    localStorage.setItem("isConnectedTo", serialize(""));
    setIsConnectedTo("");
  };
  return (
    <ConnectContext.Provider value={{ isConnectedTo, connect, disconnect }}>
      {children}
    </ConnectContext.Provider>
  );
};
export const useConnect = () => {
  return useContext(ConnectContext);
};
