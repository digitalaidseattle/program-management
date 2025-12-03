import {
  Breadcrumbs,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Partner, partnerService } from '../../services/dasPartnerService';
import { PartnerDetails } from './PartnerDetails';

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
        <Link color="inherit" href="/data/partners">
          Partners
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <PartnerDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}
export { PartnerPage };
