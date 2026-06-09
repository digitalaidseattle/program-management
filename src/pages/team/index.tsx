
// material-ui
import {
  Breadcrumbs,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Team } from '../../data/types';
import { TeamService } from '../../services/dasTeamService';
import { TeamDetails } from './TeamDetails';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }


const TeamPage = () => {
  const teamService = TeamService.getInstance();

  const [entity, setEntity] = useState<Team>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh(null);
  }, [id]);

  function refresh(_evt: any) {
    if (id) {
      teamService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/data/teams">
          Teams
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <TeamDetails entity={entity} onChange={(evt) => refresh(evt)} editable={true} />
    </Stack>
  )
}


export { TeamPage };

