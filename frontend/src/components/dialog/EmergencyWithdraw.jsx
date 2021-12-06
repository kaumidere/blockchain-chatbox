import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import { useContext, useState } from "react";
import { TRANSACTION_PREFIX } from "../../constants";
import { AppContext, ContractContext } from "../App";

function EmergencyWithdraw({ open, setOpen }) {
  const contract = useContext(ContractContext);
  const { setMessage } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({});
    const transaction = await contract.emergencyWithdraw({
      gasLimit: 300000,
    });
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
      <DialogTitle>Emergency Withdraw</DialogTitle>
      <DialogContent>
        Are you sure to withdraw your fund in emergency?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Withdraw</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmergencyWithdraw;
