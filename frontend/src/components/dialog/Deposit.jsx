import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { ContractContext } from "../App";

function Deposit({ open, setOpen }) {
  const contract = useContext(ContractContext);
  const [amount, setAmount] = useState("");
  const [timeInMonths, setTimeInMonths] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const transaction = await contract.deposit(amount, timeInMonths, {
        gasLimit: 300000,
      });
      await transaction.wait();
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {loading && <LinearProgress />}
      <DialogTitle>Deposit</DialogTitle>
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
        <TextField
          sx={{ my: 2 }}
          fullWidth
          label="Time in months"
          type="number"
          variant="standard"
          value={timeInMonths}
          onChange={(event) => setTimeInMonths(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Deposit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Deposit;
