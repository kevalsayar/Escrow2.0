import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/authContext";
import SolanaProvider from "./context/solanaProvider";
import { SolanaContextProvider } from "./context/solaServiceContext";
import { ConnectProvider } from "./context/connectContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SolanaProvider>
        <SolanaContextProvider>
          <ConnectProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ConnectProvider>
        </SolanaContextProvider>
      </SolanaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
