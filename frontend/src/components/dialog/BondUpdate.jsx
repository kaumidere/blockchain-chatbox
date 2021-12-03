import { Switch } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { ContractContext } from "../App";

function BondUpdate({ open, setOpen }) {
  const contract = useContext(ContractContext);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [minimumDeposit, setMinimumDeposit] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const transaction = await contract.updateBond(isActive, minimumDeposit);
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
