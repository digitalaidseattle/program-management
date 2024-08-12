
// material-ui
import {
  Grid,
  Typography
} from '@mui/material';

// project import
import ContributorTable from './ContributorTable';


const ContributorsPage = () => {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}><Typography variant='h2'>Digital Aid Contributors</Typography></Grid>
        <Grid item xs={12}>
          {ContributorTable()}
        </Grid>
      </Grid>
    </>
  );
};

export default ContributorsPage;
