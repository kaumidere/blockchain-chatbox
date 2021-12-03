import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DepositDialog from "./dialog/Deposit";
import EmergencyWithdrawDialog from "./dialog/EmergencyWithdraw";
import WithdrawDialog from "./dialog/Withdraw";

function getDisplayTime(seconds) {
  if (!seconds) return "N/A";
  const time = new Date(seconds * 1000);
  return time.toLocaleString();
}

function getLockPeriod(period) {
  if (!period) return "N/A";
  return `${period} month`;
}

function UserCard({ userInfo }) {
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [emergencyWithdrawDialogOpen, setEmergencyWithdrawDialogOpen] =
    useState(false);

  if (!userInfo) return <CircularProgress />;

  return (
    <Card sx={{ my: 2 }}>
      <CardHeader title="User" />
      <CardContent>
        <Typography>
          Amount Deposited: {userInfo.amountDeposited.toNumber()}
        </Typography>
        <Typography>
          Deposited On: {getDisplayTime(userInfo.depositedOn.toNumber())}
        </Typography>
        <Typography>
          Lock Period: {getLockPeriod(userInfo.lockPeriod.toNumber())}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flex: 1 }}>
          <Button
            size="small"
            color="warning"
            onClick={() => setEmergencyWithdrawDialogOpen(true)}
          >
            Emergency Withdraw
          </Button>
        </Box>
        <Button size="small" onClick={() => setWithdrawDialogOpen(true)}>
          Withdraw
        </Button>
        <Button size="small" onClick={() => setDepositDialogOpen(true)}>
          Deposit
        </Button>
      </CardActions>
      <DepositDialog open={depositDialogOpen} setOpen={setDepositDialogOpen} />
      <WithdrawDialog
        open={withdrawDialogOpen}
        setOpen={setWithdrawDialogOpen}
      />
      <EmergencyWithdrawDialog
        open={emergencyWithdrawDialogOpen}
        setOpen={setEmergencyWithdrawDialogOpen}
      />
    </Card>
  );
}

export default UserCard;
