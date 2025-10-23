
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
import { ManagedListCard } from '../../components/ManagedListCard';
import SelectVolunteerDialog from '../../components/SelectVolunteerDialog';
import { VolunteerCard } from '../../components/VolunteerCard';
import { team2VolunteerService } from '../../services/dasTeam2VolunteerService';
import { Team, teamService } from '../../services/dasTeamService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { EntityProps } from '../../components/utils';
import { Tool, toolService } from '../../services/dasToolsService';
import { team2ToolService } from '../../services/dasTeam2ToolService';
import { ToolCard } from '../tools/ToolCard';

const VolunteersCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Volunteer[]>([]);
  const [available, setAvailable] = useState<Volunteer[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      volunteerService.getActive()
        .then((active) => {
          team2VolunteerService.findVolunteersByTeamId(entity.id)
            .then(vols => {
              console.log(vols)
              setCurrent(vols);
              const teamVolunteerIds = vols.map(v => v.id) ?? [];
              const temp = active
                .filter(v => !teamVolunteerIds.includes(v.id))
                .sort((v1, v2) => v1.profile!.name.localeCompare(v2.profile!.name))
              setAvailable(temp)

            })
        });
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    return team2VolunteerService.removeVolunteerFromTeam(current[index], entity!)
      .then(() => {
        onChange(true);
        return true;
      })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    const selected = available.find(vol => vol.id === value);
    if (selected) {
      return team2VolunteerService.addVolunteerToTeam(selected, entity!)
        .then(() => {
          onChange(true);
          setShowAddDialog(false);
          return true;
        })
    } else {
      return Promise.resolve(true)
    }
  }

  return (
    < >
      <ManagedListCard
        title='Members'
        cardHeaderSx={{
          background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)"
        }}
        items={current.map(vol => <VolunteerCard key={vol.id}
          entity={vol}
          highlightOptions={{
            title: "Team lead",
            highlight: vol.leader ?? false,
          }}
          cardStyles={{ width: 200 }} />)}
        onAdd={() => setShowAddDialog(true)}
        onDelete={handleRemove}
      />
      <SelectVolunteerDialog
        open={showAddDialog}
        options={{ title: 'Add volunteer' }}
        records={available.map(v => ({ label: v.profile!.name, value: v.id }))}
        onSubmit={handleAdd}
        onCancel={() => setShowAddDialog(false)} />
    </>)
}

const ToolsCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Tool[]>([]);
  const [available, setAvailable] = useState<Tool[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      toolService.getAll()
        .then((active) => {
          team2ToolService.findToolsByTeamId(entity.id)
            .then(tools => {
              setCurrent(tools);
              const teamToolIds = tools.map(tool => tool.id) ?? [];
              const temp = active
                .filter(tool => !teamToolIds.includes(tool.id))
                .sort((t1, t2) => t1.name.localeCompare(t2.name))
              setAvailable(temp)
            })
        });
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    return team2ToolService.removeToolFromTeam(current[index], entity!)
      .then(() => {
        onChange(true);
        return true;
      })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    const selected = available.find(vol => vol.id === value);
    if (selected) {
      return team2ToolService.addToolToTeam(selected, entity!)
        .then(() => {
          onChange(true);
          setShowAddDialog(false);
          return true;
        })
    } else {
      return Promise.resolve(true)
    }
  }

  return (
    < >
      <ManagedListCard
        title='Tools'
        cardHeaderSx={{
          background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)"
        }}
        items={current.map(vol => <ToolCard key={vol.id}
          entity={vol}
          cardStyles={{ width: 200 }} />)}
        onAdd={() => setShowAddDialog(true)}
        onDelete={handleRemove}
      />
      <SelectVolunteerDialog
        open={showAddDialog}
        options={{ title: 'Add tool' }}
        records={available.map(tool => ({ label: tool.name, value: tool.id }))}
        onSubmit={handleAdd}
        onCancel={() => setShowAddDialog(false)} />
    </>)
}


const TeamPage = () => {
  const [entity, setEntity] = useState<Team | null>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
    if (id) {
      teamService.getById(id)
        .then((team) => setEntity(team));
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
        <Typography>{entity.team_name}</Typography>
      </Breadcrumbs>
      <Typography variant='h2'>{entity.team_name}</Typography>
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
      <VolunteersCard entity={entity} onChange={() => refresh()} />
      <ToolsCard entity={entity} onChange={() => refresh()} />
    </Stack>
  )
}

export default TeamPage;
