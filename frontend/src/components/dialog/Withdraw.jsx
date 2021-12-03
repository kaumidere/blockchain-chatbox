import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import { useContext, useState } from "react";
import { ContractContext } from "../App";

function Withdraw({ open, setOpen }) {
  const contract = useContext(ContractContext);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const transaction = await contract.withdraw({
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
      <DialogTitle>Withdraw</DialogTitle>
      <DialogContent>Are you sure to withdraw your fund?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Withdraw</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Withdraw;
