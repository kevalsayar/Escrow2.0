import React, { useEffect } from "react";
import styles from "./Login.module.css";
import bgImage from "../../assets/images/BackgroundImage.webp";
import MetamaskLogo from "../../assets/images/MetamaskLogo.svg";
import PhantomLogo from "../../assets/images/PhantomLogo.svg";
import TronLinkLogo from "../../assets/images/TronLinkLogo.svg";
import EscrowLogo from "../../assets/images/escrowproject-logo.webp";
import {
  connectToMetaMask,
  metamaskInstallationCheck,
  switchChain,
} from "../../services/web3.services";
import {
  NETWORK_CHAINS,
  TOAST_RESPONSE,
  successMessage,
  errorMessage,
  walletTypes,
  clientRoutes,
} from "../../utils/constants.utils";
import { useAuth } from "../../context/authContext";
import { useNavigate, useLocation } from "react-router-dom";
import { displayWalletAddress, toastMessage } from "../../utils/helper.utils";
import { fetchAccounts } from "../../services/web3.services";
import { useSolana } from "../../context/solaServiceContext";
import { useConnect } from "../../context/connectContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  connectToTron,
  tronInstallationCheck,
} from "../../services/tron.services";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const Login = () => {
  const { user, login } = useAuth();
  const { solanaAddr, setSolanaAddr } = useSolana();
  const { isConnectedTo, connect, disconnect } = useConnect();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location?.state?.path || "/transactions";
  const wallet = useAnchorWallet();
  useEffect(() => {
    if (wallet && isConnectedTo === walletTypes.pseudoPhantom) {
      connect(walletTypes.phantom);
    }
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
    if (isConnectedTo && user) navigate(redirectPath, { replace: true });
  }, [
    user,
    login,
    solanaAddr,
    isConnectedTo,
    connect,
    navigate,
    redirectPath,
    wallet,
  ]);

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className={styles.mainDiv}>
        <img
          src={EscrowLogo}
          alt="Escrow Logo"
          className={`${styles.escrowLogo} mb-4`}
        />
        <span className={styles.connect}>Connect your wallet</span>
        <div className="d-flex align-items-center">
          <img
            onClick={async () => {
              try {
                if (!(await metamaskInstallationCheck())) {
                  setTimeout(() => {
                    window.open("https://metamask.io/download/", "_blank");
                  }, 3000);
                  throw new Error(errorMessage.INSTALL_METAMASK);
                }

                const userWalletAddress = (await connectToMetaMask())[0];

                toastMessage(
                  `Connected with ${displayWalletAddress(
                    userWalletAddress,
                    5
                  )}`,
                  "toast_address_success",
                  TOAST_RESPONSE.SUCCESS
                );

                await switchChain(NETWORK_CHAINS.SEPOLIA);

                connect(walletTypes.metamask);

                !redirectPath && navigate(clientRoutes.transactions);
              } catch (error) {
                toastMessage(error.message, error.code, TOAST_RESPONSE.ERROR);
              }
            }}
            className={styles.metamaskLogo}
            src={MetamaskLogo}
            alt="Metamask Logo"
          />
          <WalletMultiButton
            className={styles.hide}
            onClick={() => {
              connect(walletTypes.pseudoPhantom);
            }}
          >
            <img
              className={styles.metamaskLogo}
              src={PhantomLogo}
              alt="Phantom Logo"
            />
          </WalletMultiButton>
          <img
            className={styles.metamaskLogo}
            src={TronLinkLogo}
            alt="Tron"
            onClick={async () => {
              if (tronInstallationCheck()) {
                toastMessage(
                  successMessage.TRONLINK_INSTALLED,
                  "toast_tron_install",
                  TOAST_RESPONSE.SUCCESS
                );
                const res = await connectToTron();
                if (res) {
                  toastMessage(
                    `Connected to wallet ${displayWalletAddress(res, 5)}`,
                    "toast_tron_address_success",
                    TOAST_RESPONSE.SUCCESS
                  );
                  connect(walletTypes.tronlink);
                  login(res);
                } else {
                  toastMessage(
                    errorMessage.UNLOCK_WALLET,
                    "toast_unlock",
                    TOAST_RESPONSE.ERROR
                  );
                }
              } else {
                toastMessage(
                  errorMessage.INSTALL_TRONLINK,
                  "toast_install_tron",
                  TOAST_RESPONSE.ERROR
                );
                setTimeout(() => {
                  window.open("https://www.tronlink.org/", "_blank");
                }, 3000);
              }
            }}
          />
        </div>
        <div>
          <span className={`${styles.margin75} fs-3`}>MetaMask</span>
          <span className={`${styles.margin75} fs-3`}>Phantom</span>
          <span className={`${styles.margin75} fs-3`}>TronLink</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
