
// material-ui
import {
  Breadcrumbs,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { StaffingTable } from '../../components/StaffingTable';
import { EntityProps } from '../../components/utils';
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { Venture, ventureService } from '../../services/dasVentureService';

const VolunteersCard: React.FC<EntityProps<Venture>> = ({ entity }) => {
  const [current, setCurrent] = useState<Staffing[]>([]);

  useEffect(() => {
    if (entity) {
      staffingService.findByVentureId(entity.id)
        .then((staffing) => {
          setCurrent(staffing)
        });
    }
  }, [entity]);

  return (< >
    <StaffingTable title="Staffing" items={current} />
  </>)
}

const VentureDetails: React.FC<EntityProps<Venture>> = ({ entity, onChange }) => {
  return (entity &&
    <>
      <Stack gap={3}>
        <TextField id="outlined-basic" label="Name" variant="outlined" value={entity.venture_code} />
      </Stack>
      <VolunteersCard entity={entity} onChange={onChange} />
    </>
  )
}

const VenturePage = () => {
  const [entity, setEntity] = useState<Venture>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
    if (id) {
      ventureService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/ventures">
          Ventures
        </Link>
        <Typography>{entity.venture_code}</Typography>
      </Breadcrumbs>
      <VentureDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}
export { VentureDetails, VenturePage };

