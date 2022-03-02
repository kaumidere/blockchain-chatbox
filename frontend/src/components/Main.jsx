import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import { useContext, useEffect, useState } from "react";
import { AppContext, ContractContext } from "./App";
import BondCard from "./BondCard";
import UserCard from "./UserCard";
import {ethers} from "ethers";

function Main() {
  const { bond: bondContract, token: tokenContract } = useContext(ContractContext);
  const { message, setMessage } = useContext(AppContext);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [bondInfo, setBondInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setMessage({});
    } catch (error) {
      setMessage({ type: "error", content: error.message });
    }
  };

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        }
      } catch (error) {
        setMessage({ type: "error", content: error.message });
      }
    };

    initializeWallet();
  }, [setMessage]);

  useEffect(() => {
    const tokenDecimalsPromise = tokenContract.decimals();

    const getBondInfo = async () => {
      try {
        const tokenDecimals = await tokenDecimalsPromise;

        const bondInfo = await bondContract.bondInfo();

        setBondInfo({
          ...bondInfo,
          minimumDeposit: ethers.utils.formatUnits(bondInfo.minimumDeposit, tokenDecimals)
        });
      } catch (error) {
        setMessage({ type: "error", content: error.message });
      }
    };

    const getUserInfo = async () => {
      try {
        const tokenDecimals = await tokenDecimalsPromise;

        const userInfo = await bondContract.userInfo(currentAccount);

        setUserInfo({
          ...userInfo,
          amountDeposited: ethers.utils.formatUnits(userInfo.amountDeposited, tokenDecimals)
        });
      } catch (error) {
        setMessage({ type: "error", content: error.message });
      }
    };

    if (currentAccount) {
      getBondInfo();
      getUserInfo();
    }
  }, [currentAccount, bondContract, tokenContract, setMessage]);

  return (
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      {currentAccount && <Chip label={`Connected: ${currentAccount}`} />}
      {message.content && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.content}
        </Alert>
      )}
      {!currentAccount && (
        <Button variant="outlined" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
      {currentAccount && <BondCard bondInfo={bondInfo} />}
      {currentAccount && <UserCard userInfo={userInfo} />}
    </Container>
  );
}

export default Main;
