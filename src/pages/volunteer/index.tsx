
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
import { ManagedListCard } from '../../components/ManagedListCard';
import { TeamCard } from '../../components/TeamCard';
import { EntityProps } from '../../components/utils';
import { Discipline } from '../../services/dasDisciplineService';
import { team2VolunteerService } from '../../services/dasTeam2VolunteerService';
import { Team } from '../../services/dasTeamService';
import { Tool } from '../../services/dasToolsService';
import { volunteer2DisciplineService } from '../../services/dasVolunteer2DisciplineService';
import { volunteer2ToolService } from '../../services/dasVolunteer2ToolService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { DisciplineCard } from '../disciplines/DisciplineCard';
import { ToolCard } from '../tools/ToolCard';
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { VentureCard } from '../ventures/VentureCard';

const TeamsCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Team[]>([]);
  const [available, setAvailable] = useState<Team[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      team2VolunteerService.findTeamsByVolunteerId(entity.id)
        .then((teams) => {
          setCurrent(teams)
        });
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    throw new Error('handleRemove')
    // return team2VolunteerService.removeVolunteerFromTeam(current[index], entity!)
    //   .then(() => {
    //     onChange(true);
    //     return true;
    //   })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    throw new Error('handleAdd')

    //   const selected = available.find(vol => vol.id === value);
    //   if (selected) {
    //     return team2VolunteerService.addVolunteerToTeam(selected, entity!)
    //       .then(() => {
    //         onChange(true);
    //         setShowAddDialog(false);
    //         return true;
    //       })
    //   } else {
    //     return Promise.resolve(true)
    //   }
    // }
  }

  return (< >
    <ManagedListCard
      title='Teams'
      items={current.map(team => <TeamCard key={team.id}
        entity={team}
        cardStyles={{ width: 200 }} />)}
      cardHeaderSx={{
        background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)"
      }}
      onAdd={() => setShowAddDialog(true)}
      onDelete={handleRemove}
    />
    {/* <SelectTeamDialog
        open={showAddDialog}
        options={{ title: 'Add volunteer' }}
        records={available.map(v => ({ label: v.profile!.name, value: v.id }))}
        onSubmit={handleAdd}
        onCancel={() => setShowAddDialog(false)} /> */}
  </>)
}

const DisciplinesCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Discipline[]>([]);
  const [available, setAvailable] = useState<Discipline[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      volunteer2DisciplineService.findDisciplinesByVolunteerId(entity.id)
        .then((disciplines) => setCurrent(disciplines));
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    throw new Error('handleRemove')
    // return team2VolunteerService.removeVolunteerFromTeam(current[index], entity!)
    //   .then(() => {
    //     onChange(true);
    //     return true;
    //   })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    throw new Error('handleAdd')

    //   const selected = available.find(vol => vol.id === value);
    //   if (selected) {
    //     return team2VolunteerService.addVolunteerToTeam(selected, entity!)
    //       .then(() => {
    //         onChange(true);
    //         setShowAddDialog(false);
    //         return true;
    //       })
    //   } else {
    //     return Promise.resolve(true)
    //   }
    // }
  }

  return (< >
    <ManagedListCard
      title='Disciplines'
      items={current.map(discipline => <DisciplineCard key={discipline.id}
        entity={discipline}
        cardStyles={{ width: 200 }} />)}
      cardHeaderSx={{
        background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)"
      }}
      onAdd={() => setShowAddDialog(true)}
      onDelete={handleRemove}
    />
    {/* <SelectTeamDialog
        open={showAddDialog}
        options={{ title: 'Add volunteer' }}
        records={available.map(v => ({ label: v.profile!.name, value: v.id }))}
        onSubmit={handleAdd}
        onCancel={() => setShowAddDialog(false)} /> */}
  </>)
}

const ToolsCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Tool[]>([]);
  const [available, setAvailable] = useState<Tool[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      volunteer2ToolService.findToolsByVolunteerId(entity.id)
        .then((tools) => {
          setCurrent(tools)
        });
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    throw new Error('handleRemove')
    // return team2VolunteerService.removeVolunteerFromTeam(current[index], entity!)
    //   .then(() => {
    //     onChange(true);
    //     return true;
    //   })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    throw new Error('handleAdd')

    //   const selected = available.find(vol => vol.id === value);
    //   if (selected) {
    //     return team2VolunteerService.addVolunteerToTeam(selected, entity!)
    //       .then(() => {
    //         onChange(true);
    //         setShowAddDialog(false);
    //         return true;
    //       })
    //   } else {
    //     return Promise.resolve(true)
    //   }
    // }
  }

  return (< >
    <ManagedListCard
      title='Tools'
      items={current.map(tool => <ToolCard key={tool.id}
        entity={tool}
        cardStyles={{ width: 200 }} />)}
      cardHeaderSx={{
        background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)"
      }}
      onAdd={() => setShowAddDialog(true)}
      onDelete={handleRemove}
    />
    {/* <SelectTeamDialog
        open={showAddDialog}
        options={{ title: 'Add volunteer' }}
        records={available.map(v => ({ label: v.profile!.name, value: v.id }))}
        onSubmit={handleAdd}
        onCancel={() => setShowAddDialog(false)} /> */}
  </>)
}

const VenturesCard: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Staffing[]>([]);
  const [available, setAvailable] = useState<Staffing[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      staffingService.findByVolunteerId(entity.id)
        .then((staffing) => {
          console.log(staffing)
          setCurrent(staffing)
        });
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    throw new Error('handleRemove')
    // return team2VolunteerService.removeVolunteerFromTeam(current[index], entity!)
    //   .then(() => {
    //     onChange(true);
    //     return true;
    //   })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    throw new Error('handleAdd')

    //   const selected = available.find(vol => vol.id === value);
    //   if (selected) {
    //     return team2VolunteerService.addVolunteerToTeam(selected, entity!)
    //       .then(() => {
    //         onChange(true);
    //         setShowAddDialog(false);
    //         return true;
    //       })
    //   } else {
    //     return Promise.resolve(true)
    //   }
    // }
  }

  return (< >
    <ManagedListCard
      title='Ventures'
      items={current.map(staffing => <VentureCard key={staffing.venture!.id}
        entity={staffing.venture!}
        cardStyles={{ width: 200 }} />)}
      cardHeaderSx={{
        background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)"
      }}
    />
  </>)
}

const VolunteerPage = () => {
  const [entity, setEntity] = useState<Volunteer>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
    if (id) {
      volunteerService.getById(id, '*, profile(*)')
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <>
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
        <Stack gap={3}>
          <TextField id="outlined-basic" label="Name" variant="outlined" value={entity.profile!.name} />
          <TextField id="outlined-basic" label="First Name" variant="outlined" value={entity.profile!.first_name} />
          <TextField id="outlined-basic" label="Last Name" variant="outlined" value={entity.profile!.last_name} />
          <TextField id="outlined-basic" label="Join Date" variant="outlined" value={entity.join_date} />
          <TextField id="outlined-basic" label="Status" variant="outlined" value={entity.status} />
          <TextField id="outlined-basic" label="LinkedIn" variant="outlined" value={entity.linkedin} />
        </Stack>
        <TeamsCard entity={entity} onChange={() => refresh()} />
        <DisciplinesCard entity={entity} onChange={() => refresh()} />
        <ToolsCard entity={entity} onChange={() => refresh()} />
        <VenturesCard entity={entity} onChange={() => refresh()} />
      </Stack>
    </>
  )
}

export default VolunteerPage;
