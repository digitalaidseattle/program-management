
// material-ui
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from "react-router";
import { storageService } from '../../App';
import { ManagedListCard } from '../../components/ManagedListCard';
import { team2ToolService } from '../../services/dasTeam2ToolService';
import { Team } from '../../services/dasTeamService';
import { Tool, toolService } from '../../services/dasToolsService';
import { volunteer2ToolService } from '../../services/dasVolunteer2ToolService';
import { Volunteer } from '../../services/dasVolunteerService';

const ReferenceToolDetails = ({ entity }: { entity: Tool }) => {
  const navigate = useNavigate();
  const [teamCards, setTeamCards] = useState<React.ReactNode[]>([]);
  const [volunteerCards, setVolunteerCards] = useState<React.ReactNode[]>([]);


  useEffect(() => {
    if (entity) {
      team2ToolService.findTeamsByToolId(entity.id)
        .then(teams => { setTeamCards(teams.map((team) => createTeamCard(team))) })
      volunteer2ToolService.findVolunteersByToolId(entity.id)
        .then(volunteers => { setVolunteerCards(volunteers.map((volunteer) => createVolunteerCard(volunteer))) })
    }
  }, [entity]);

  function createTeamCard(team: Team) {
    // FIXME navigate to reference page /team
    const navUrl = `/data/team/${team.id}`;
    // FIXME migrate to team.pic
    const picUrl = storageService.getUrl(`icons/${team.id}`);

    return <Card key={team.id}
      sx={{ width: 200 }}>
      <CardActionArea onClick={() => navigate(navUrl)}>
        <CardHeader
          title={team.name}
          avatar={<Avatar
            src={picUrl}
            alt={`${entity.name} icon`}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />}
        />
      </CardActionArea>
    </Card>
  }

  function createVolunteerCard(volunteer: Volunteer) {
    // FIXME navigate to reference page /volunteer
    const navUrl = `/data/volunteer/${volunteer.id}`;
    // FIXME migrate to profile.pic
    const picUrl = storageService.getUrl(`profiles/${volunteer.profile!.id}`);

    return <Card key={volunteer.id}
      sx={{ width: 200 }}>
      <CardActionArea onClick={() => navigate(navUrl)}>
        <CardHeader
          title={volunteer.profile!.name}
          avatar={<Avatar
            src={picUrl}
            alt={`${entity.name} icon`}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />}
        />
      </CardActionArea>
    </Card>
  }

  return (entity &&
    <Card sx={{ padding: 0 }}>
      <CardHeader
        slotProps={{ title: { fontSize: 24 } }}
        title={entity.name}
        subheader={<Markdown>{entity.overview}</Markdown>}
      />
      <CardContent >
        <Stack sx={{ gap: 2 }}>
          <Grid container spacing={2}>
            <Grid size={3}>
              <Avatar
                sx={{ width: '100%', height: '100%' }}
                variant="rounded"
                src={toolService.getLogoUrl(entity)} />
            </Grid>
            <Grid size={9}>
              <Chip label={entity.status} color={entity.status === 'active' ? 'success' : 'error'} />
              <Markdown>
                {entity.description}
              </Markdown>
            </Grid>
          </Grid>
          <ManagedListCard title={'Teams'} items={teamCards} />
          <ManagedListCard title={'Volunteers'} items={volunteerCards} />
        </Stack>
      </CardContent>
    </Card >
  )

}

export { ReferenceToolDetails };

