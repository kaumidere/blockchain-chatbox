import { Switch } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { TRANSACTION_PREFIX } from "../../constants";
import { AppContext, ContractContext } from "../App";
import {ethers} from "ethers";

function BondSetup({ open, setOpen }) {
  const { bond: bondContract, token: tokenContract } = useContext(ContractContext);
  const { setMessage } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [interestOneMonth, setInterestOneMonth] = useState("");
  const [interestThreeMonth, setInterestThreeMonth] = useState("");
  const [interestSixMonth, setInterestSixMonth] = useState("");
  const [interestTwelveMonth, setInterestTwelveMonth] = useState("");
  const [minimumDeposit, setMinimumDeposit] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({});

    const tokenDecimals = await tokenContract.decimals();

    const transaction = await bondContract.setupBond(
      isActive,
      interestOneMonth,
      interestThreeMonth,
      interestSixMonth,
      interestTwelveMonth,
      ethers.utils.parseUnits(minimumDeposit, tokenDecimals),
      {
        gasLimit: 300000,
      }
    );

    try {
      await transaction.wait();

      setMessage({
        type: "success",
        content: (
          <Link
            href={`${TRANSACTION_PREFIX}${transaction.hash}`}
            target="_blank"
            rel="noopener"
          >
            Transaction Succeeded
          </Link>
        ),
      });
    } catch (error) {
      setMessage({
        type: "error",
        content: (
          <Link
            href={`${TRANSACTION_PREFIX}${transaction.hash}`}
            target="_blank"
            rel="noopener"
          >
            Transaction Failed
          </Link>
        ),
      });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {loading && <LinearProgress />}
      <DialogTitle>Setup Bond</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />
          }
          label={isActive ? "Active" : "Inactive"}
        />
        <TextField
          sx={{ my: 1 }}
          fullWidth
          label="Interest One Month"
          type="number"
          variant="standard"
          value={interestOneMonth}
          onChange={(event) => setInterestOneMonth(event.target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          fullWidth
          label="Interest Three Month"
          type="number"
          variant="standard"
          value={interestThreeMonth}
          onChange={(event) => setInterestThreeMonth(event.target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          fullWidth
          label="Interest Six Month"
          type="number"
          variant="standard"
          value={interestSixMonth}
          onChange={(event) => setInterestSixMonth(event.target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          fullWidth
          label="Interest Twelve Month"
          type="number"
          variant="standard"
          value={interestTwelveMonth}
          onChange={(event) => setInterestTwelveMonth(event.target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          fullWidth
          label="Minimum Deposit"
          type="number"
          variant="standard"
          value={minimumDeposit}
          onChange={(event) => setMinimumDeposit(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Set up</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BondSetup;
