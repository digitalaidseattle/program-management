
// material-ui
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import {
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
import { useParams } from 'react-router';
import { EntityProps } from '../../components/utils';
import { Team, teamService } from '../../services/dasTeamService';
import { ForecastsCard } from './ForecastsCard';
import { ToolsCard } from './ToolsCard';
import { SlackButton } from '../../components/SlackButton';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }

const TeamDetails: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  return (entity &&
    <>
      <Stack direction={'row'}>
        <SlackButton url={entity.slack_channel} />
        <Typography variant='h2'>{entity.name}</Typography>
      </Stack>
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

  const inputFields: InputOption[] = [
    {
      label: 'Purpose',
      name: "purpose",
      type: 'string',
      disabled: false
    },
    {
      label: 'What is NOT included in this Team?',
      name: "not_included",
      type: 'string',
      disabled: false,
    },
    {
      label: 'New to the team?',
      name: "welcome_message",
      type: 'string',
      disabled: false,
    },
    {
      label: 'Slack',
      name: "slack_channel",
      type: 'string',
      disabled: false,
    }
  ]
  return (entity &&
    <Stack gap={2}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              titleTypographyProps={{ fontSize: 24 }}
              title='Details'>
            </CardHeader>
            <CardContent>
              <InputForm
                entity={entity}
                inputFields={inputFields}
                onChange={function (_field: string, _value: any): void { throw new Error('Function not implemented.'); }}>
              </InputForm>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <OKRsCard entity={entity} onChange={onChange} />
            <ForecastsCard entity={entity} onChange={onChange} />
          </Stack>
        </Grid>
      </Grid>
      <VolunteersCard entity={entity} onChange={onChange} />
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
        <Link color="inherit" href="/teams">
          Teams
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <TeamDetails entity={entity} onChange={(evt) => refresh(evt)} />
    </Stack>
  )
}


export { TeamDetails, TeamPage };

