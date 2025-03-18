
// material-ui
import {
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import StaffingTable from './StaffingTable';

import Markdown from 'react-markdown';

// project import
const message = 'If you are interested in one of these positions, please send a message to the Slack channel #request-hr-help giving the Venture and Role. Someone will get back with you to discuss if it is a good fit.';

const StaffingPage = () => {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}><Typography variant='h2'>Open Positions</Typography></Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Please Note
              </Typography>
              <Markdown>
                {message}
              </Markdown>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <StaffingTable />
        </Grid>
      </Grid>
    </>
  );
};

export default StaffingPage;
