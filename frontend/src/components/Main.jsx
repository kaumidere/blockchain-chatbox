import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import { useContext, useEffect, useState } from "react";
import { AppContext, ContractContext } from "./App";
import BondCard from "./BondCard";
import UserCard from "./UserCard";

function Main() {
  const contract = useContext(ContractContext);
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
    const getBondInfo = async () => {
      try {
        const bondInfo = await contract.bondInfo();
        setBondInfo(bondInfo);
      } catch (error) {
        setMessage({ type: "error", content: error.message });
      }
    };

    const getUserInfo = async () => {
      try {
        const userInfo = await contract.userInfo(currentAccount);
        setUserInfo(userInfo);
      } catch (error) {
        setMessage({ type: "error", content: error.message });
      }
    };

    if (currentAccount) {
      getBondInfo();
      getUserInfo();
    }
  }, [currentAccount, contract, setMessage]);

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
