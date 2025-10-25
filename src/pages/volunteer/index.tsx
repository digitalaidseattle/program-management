/**
 *  volunteer/index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

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
import { EntityProps } from '../../components/utils';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { DisciplinesCard } from './DisplinesCard';
import { TeamsCard } from './TeamsCard';
import { ToolsCard } from './ToolsCard';
import { VenturesCard } from './venturesCard';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)" }

const VolunteerDetails: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {

  return (entity &&
    <>
      <Stack gap={3}>
        <TextField id="outlined-basic" label="Name" variant="outlined" value={entity.profile!.name} />
        <TextField id="outlined-basic" label="First Name" variant="outlined" value={entity.profile!.first_name} />
        <TextField id="outlined-basic" label="Last Name" variant="outlined" value={entity.profile!.last_name} />
        <TextField id="outlined-basic" label="Join Date" variant="outlined" value={entity.join_date} />
        <TextField id="outlined-basic" label="Status" variant="outlined" value={entity.status} />
        <TextField id="outlined-basic" label="LinkedIn" variant="outlined" value={entity.linkedin} />
      </Stack>
      <TeamsCard entity={entity} onChange={onChange} />
      <DisciplinesCard entity={entity} onChange={onChange} />
      <ToolsCard entity={entity} onChange={onChange} />
      <VenturesCard entity={entity} onChange={onChange} />
    </>
  )
}

const VolunteerPage = () => {
  const [entity, setEntity] = useState<Volunteer>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
    if (id) {
      volunteerService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/volunteers">
          Volunteers
        </Link>
        <Typography>{entity.profile!.name}</Typography>
      </Breadcrumbs>
      <VolunteerDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}

export { VolunteerDetails, VolunteerPage };

