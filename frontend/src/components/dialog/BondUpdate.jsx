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

function BondUpdate({ open, setOpen }) {
  const contract = useContext(ContractContext);
  const { setMessage } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [minimumDeposit, setMinimumDeposit] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({});
    const transaction = await contract.updateBond(isActive, minimumDeposit, {
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
      <DialogTitle>Update Bond</DialogTitle>
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
          label="Minimum Deposit"
          type="number"
          variant="standard"
          value={minimumDeposit}
          onChange={(event) => setMinimumDeposit(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BondUpdate;
