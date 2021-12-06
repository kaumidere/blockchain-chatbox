import { ThemeProvider } from "@mui/material";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import LinearProgress from "@mui/material/LinearProgress";
import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import abi from "../abi/FixedBond.json";
import { BOND_CONTRACT_ADDRESS } from "../constants";
import theme from "../theme";
import Main from "./Main";

export const ContractContext = createContext();

export const AppContext = createContext({
  message: {},
  setMessage: () => {},
});

function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(BOND_CONTRACT_ADDRESS, abi.abi, signer);
  return contract;
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({});

  useEffect(() => {
    async function checkWallet() {
      const { ethereum } = window;
      if (!ethereum) {
        setError("Make sure you have Metamask installed!");
      } else {
        const chainId = await ethereum.request({ method: "eth_chainId" });
        if (chainId !== "0x2a") {
          setError("Make sure you are on Kovan network!");
        }
      }
      setLoaded(true);
    }
    checkWallet();
  }, []);

  if (!loaded) return <LinearProgress />;

  if (error)
    return (
      <Container maxWidth="sm">
        <Alert severity="warning">{error}</Alert>
      </Container>
    );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContractContext.Provider value={getContract()}>
        <AppContext.Provider value={{ message, setMessage }}>
          <Main />
        </AppContext.Provider>
      </ContractContext.Provider>
    </ThemeProvider>
  );
}

export default App;
