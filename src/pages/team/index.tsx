
// material-ui
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'react-router';
import { EntityProps } from '../../components/utils';
import { Team, teamService } from '../../services/dasTeamService';
import { VolunteersCard } from './VolunteersCard';
import { ToolsCard } from './ToolsCard';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }

const TeamDetails: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  return (entity &&
    <>
      <Typography variant='h2'>{entity.name}</Typography>
      <Card>
        <CardHeader
          titleTypographyProps={{ fontSize: 24 }}
          title='Purpose'>
        </CardHeader>
        <CardContent>
          <Markdown>
            {entity.purpose}
          </Markdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          titleTypographyProps={{ fontSize: 24 }}
          title='What is NOT included in this Team?'>
        </CardHeader>
        <CardContent>
          <Markdown>
            {entity.not_included}
          </Markdown>
        </CardContent>
      </Card>

      <Card >
        <CardHeader
          titleTypographyProps={{ fontSize: 24 }}
          title='New to the team?'>
        </CardHeader>
        <CardContent>
          <Markdown>
            {entity.welcome_message}
          </Markdown>
        </CardContent>
      </Card>
      <Card >
        <CardHeader
          titleTypographyProps={{ fontSize: 24 }}
          title='Slack'>
        </CardHeader>
        <CardContent>
          <Markdown>
            {entity.slack_channel}
          </Markdown>
        </CardContent>
      </Card>
      <VolunteersCard entity={entity} onChange={onChange} />
      <ToolsCard entity={entity} onChange={onChange} />
    </>
  )
}

const TeamPage = () => {
  const [entity, setEntity] = useState<Team>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
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
        <Link color="inherit" href="/teams">
          Teams
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <TeamDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}

export { TeamDetails, TeamPage };

