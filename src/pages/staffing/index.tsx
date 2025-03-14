
// material-ui
import {
  Grid,
  Typography
} from '@mui/material';
import StaffingTable from './StaffingTable';

// project import


const StaffingPage = () => {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}><Typography variant='h2'>Open Positions</Typography></Grid>
        <Grid item xs={12}>
          <StaffingTable />
        </Grid>
      </Grid>
    </>
  );
};

export default StaffingPage;
