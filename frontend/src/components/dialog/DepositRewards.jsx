import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { TRANSACTION_PREFIX } from "../../constants";
import { AppContext, ContractContext } from "../App";
import {ethers} from "ethers";

function DepositRewards({ open, setOpen }) {
  const { bond: bondContract, token: tokenContract } = useContext(ContractContext);
  const { setMessage } = useContext(AppContext);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({});

    const tokenDecimals = await tokenContract.decimals();

    const amountParsed = ethers.utils.parseUnits(amount, tokenDecimals);

    const setAllowanceTransaction = await tokenContract.approve(bondContract.address, amountParsed, {
      gasLimit: 300000,
    });

    try {
      await setAllowanceTransaction.wait();

      const depositTransaction = await bondContract.depositRewards(amountParsed, {
        gasLimit: 300000,
      });
      await depositTransaction.wait();

      setMessage({
        type: "success",
        content: (
          <Link
            href={`${TRANSACTION_PREFIX}${depositTransaction.hash}`}
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
            href={`${TRANSACTION_PREFIX}${error.receipt.transactionHash}`}
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
      <DialogTitle>Deposit Rewards</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ my: 2 }}
          fullWidth
          label="Amount"
          type="number"
          variant="standard"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Deposit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DepositRewards;
