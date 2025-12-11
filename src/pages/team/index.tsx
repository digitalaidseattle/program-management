
// material-ui
import {
  Avatar,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import Markdown from "react-markdown";
import { useParams } from 'react-router';
import { EntityProps } from '../../components/utils';
import { Team, teamService } from '../../services/dasTeamService';
import { ForecastsCard } from './ForecastsCard';
import { OKRsCard } from './OKRsCard';
import { ToolsCard } from './ToolsCard';
import { VolunteersCard } from './VolunteersCard';
import { storageService } from '../../App';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }

type TeamDetailsdProps = EntityProps<Team> & {
  editable?: boolean
}

const TeamDetails: React.FC<TeamDetailsdProps> = ({ entity, onChange, editable = false }) => {
  return (entity &&
    <Stack gap={2}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction={'row'} sx={{ gap: 2, alignItems: 'center' }}>
            <Avatar
              src={storageService.getUrl(`/icons/${entity.id}`)}>
            </Avatar>
            <Typography variant="h3">{entity.name}</Typography>
          </Stack>
        </Grid>
        <Grid size={6}>
          <Stack spacing={2}>
            <OKRsCard entity={entity} editable={editable} onChange={onChange} />
            <ForecastsCard entity={entity} editable={editable} onChange={onChange} />
          </Stack>
        </Grid>
        <Grid size={6}>
          <Card >
            <CardHeader
              title='Details'>
            </CardHeader>
            <CardContent>
              <Stack gap={1}>
                <Card>
                  <CardHeader title="Purpose" />
                  <CardContent>
                    <Markdown>{entity.purpose}</Markdown>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader title="What is NOT included in this Team?" />
                  <CardContent>
                    <Markdown>{entity.not_included}</Markdown>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader title="New to the team?" />
                  <CardContent>
                    <Markdown>{entity.welcome_message}</Markdown>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader title="Slack" />
                  <CardContent>
                    <Markdown>{entity.slack_channel}</Markdown>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
      <VolunteersCard entity={entity} onChange={onChange} editable={editable} />
      <ToolsCard entity={entity} onChange={onChange} />
    </Stack>
  )
}

const TeamPage = () => {
  const [entity, setEntity] = useState<Team>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh(null);
  }, [id]);

  function refresh(_evt: any) {
    if (id) {
      teamService.getById(id, '*')
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


export { TeamDetails, TeamPage };

