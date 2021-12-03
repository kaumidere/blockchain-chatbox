import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "./App";
import BondCard from "./BondCard";
import UserCard from "./UserCard";

function Main() {
  const contract = useContext(ContractContext);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [bondInfo, setBondInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
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
        setErrorMessage(error.message);
      }
    };

    initializeWallet();
  }, []);

  useEffect(() => {
    const getBondInfo = async () => {
      try {
        const bondInfo = await contract.bondInfo();
        setBondInfo(bondInfo);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    const getUserInfo = async () => {
      try {
        const userInfo = await contract.userInfo(currentAccount);
        setUserInfo(userInfo);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    if (currentAccount) {
      getBondInfo();
      getUserInfo();
    }
  }, [currentAccount, contract]);

  return (
    <Container maxWidth="sm" sx={{ pt: 2 }}>
      {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
      {currentAccount && <Alert severity="success">{currentAccount}</Alert>}
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
