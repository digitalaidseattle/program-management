
// material-ui
import {
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { partnerService, SupabasePartner } from '../../services/dasPartnerService';

const LEFT_WIDTH = 2;
const RIGHT_WIDTH = 8;

const PartnerPage = () => {
  const [partner, setPartner] = useState<SupabasePartner>();
  const { id: planId } = useParams<string>();

  useEffect(() => {
    if (planId) {
      partnerService.getById(planId)
        .then((p) => setPartner(p!));
    }
  }, [planId]);


  return (partner &&
    <Paper>
      <Grid container gap={1}>
        <Grid xs={LEFT_WIDTH}>
          <Typography>Name</Typography>
        </Grid>
        <Grid xs={RIGHT_WIDTH}>
          <Typography>{partner.name}</Typography>
        </Grid>
        <Grid xs={LEFT_WIDTH}>
          <Typography>Type</Typography>
        </Grid>
        <Grid xs={RIGHT_WIDTH}>
          <Typography>{partner.type}</Typography>
        </Grid>
        <Grid xs={LEFT_WIDTH}>
          <Typography>Status</Typography>
        </Grid>
        <Grid xs={RIGHT_WIDTH}>
          <Typography>{partner.status}</Typography>
        </Grid>
        <Grid xs={LEFT_WIDTH}>
          <Typography>Website</Typography>
        </Grid>
        <Grid xs={RIGHT_WIDTH}>
          <a href={partner.website} target='_blank'>{partner.website}</a>
        </Grid>
        <Grid xs={LEFT_WIDTH}>
          <Typography>Foci</Typography>
        </Grid>
        <Grid xs={RIGHT_WIDTH}>
          <Typography>{partner.foci ? partner.foci.join(', ') : ''}</Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default PartnerPage;
