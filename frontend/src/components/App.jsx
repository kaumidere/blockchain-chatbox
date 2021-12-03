import { ThemeProvider } from "@mui/material";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ethers } from "ethers";
import { createContext } from "react";
import abi from "../abi/FixedBond.json";
import { BOND_CONTRACT_ADDRESS } from "../constants";
import theme from "../theme";
import Main from "./Main";

export const ContractContext = createContext();

function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(BOND_CONTRACT_ADDRESS, abi.abi, signer);
  return contract;
}

function App() {
  const { ethereum } = window;
  if (!ethereum) {
    return (
      <Container maxWidth="sm">
        <Alert severity="warning">Make sure you have Metamask installed!</Alert>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContractContext.Provider value={getContract()}>
        <Main />
      </ContractContext.Provider>
    </ThemeProvider>
  );
}

export default App;
