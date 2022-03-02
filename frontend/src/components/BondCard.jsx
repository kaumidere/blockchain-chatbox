import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import BondSetupDialog from "./dialog/BondSetup";
import BondUpdateDialog from "./dialog/BondUpdate";
import DepositRewardsDialog from "./dialog/DepositRewards";

function BondCard({ bondInfo }) {
  const [bondSetupDialogOpen, setBondSetupDialogOpen] = useState(false);
  const [bondUpdateDialogOpen, setBondUpdateDialogOpen] = useState(false);
  const [depositRewardsDialogOpen, setDepositRewardsDialogOpen] =
    useState(false);
  if (!bondInfo) return <CircularProgress />;

  return (
    <Card sx={{ my: 2 }}>
      <CardHeader
        title="Bond"
        subheader={`Minimum Deposit: ${bondInfo.minimumDeposit}`}
        action={
          bondInfo.isActive ? (
            <Chip label="Active" variant="outlined" color="success" />
          ) : (
            <Chip label="Inactive" variant="outlined" />
          )
        }
      />
      <CardContent>
        <Typography>
          1 Month Interest: {bondInfo.interestOneMonth.toNumber()}
        </Typography>
        <Typography>
          3 Month Interest: {bondInfo.interestThreeMonth.toNumber()}
        </Typography>
        <Typography>
          6 Month Interest: {bondInfo.interestSixMonth.toNumber()}
        </Typography>
        <Typography>
          12 Month Interest: {bondInfo.interestTwelveMonth.toNumber()}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ flex: 1 }}>
          <Button
            size="small"
            color="warning"
            onClick={() => setDepositRewardsDialogOpen(true)}
          >
            Deposit Rewards
          </Button>
        </Box>
        <Button size="small" onClick={() => setBondUpdateDialogOpen(true)}>
          Update
        </Button>
        <Button size="small" onClick={() => setBondSetupDialogOpen(true)}>
          Setup
        </Button>
      </CardActions>
      <BondSetupDialog
        open={bondSetupDialogOpen}
        setOpen={setBondSetupDialogOpen}
      />
      <BondUpdateDialog
        open={bondUpdateDialogOpen}
        setOpen={setBondUpdateDialogOpen}
      />
      <DepositRewardsDialog
        open={depositRewardsDialogOpen}
        setOpen={setDepositRewardsDialogOpen}
      />
    </Card>
  );
}

export default BondCard;
