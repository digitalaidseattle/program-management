
// material-ui
import {
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { partnerService, Partner } from '../../services/dasPartnerService';
import { EntityProps } from '../../components/utils';

const LEFT_WIDTH = 2;
const RIGHT_WIDTH = 8;

const PartnerDetails: React.FC<EntityProps<Partner>> = ({ entity: partner }) => {
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


const PartnerPage = () => {
  const [entity, setEntity] = useState<Partner>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
    if (id) {
      partnerService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/partners">
          Partners
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <PartnerDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}
export { PartnerDetails, PartnerPage };
