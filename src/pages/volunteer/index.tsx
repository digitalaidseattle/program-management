/**
 *  volunteer/index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

// material-ui
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import {
  Breadcrumbs,
  Card,
  CardContent,
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
import { VenturesCard } from './VenturesCard';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)" }

const VolunteerDetails: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {

  const fields = [
    {
      name: 'profile.name', label: 'Name', type: 'custom', disabled: false,
      inputRenderer: (idx: number, _optio: InputOption, _value: any) => {
        return <TextField key={idx} id="outlined-basic" label="Name" variant="outlined" value={entity.profile!.name} />
      }
    },
    {
      name: 'profile.first_name', label: 'First Name', type: 'string', disabled: false,
      inputRenderer: (idx: number, _optio: InputOption, _value: any) => {
        return <TextField key={idx} id="outlined-basic" label="First Name" variant="outlined" value={entity.profile!.first_name} />
      }
    },
    {
      name: 'profile.last_name', label: 'Last Name', type: 'string', disabled: false,
      inputRenderer: (idx: number, _optio: InputOption, _value: any) => {
        return <TextField key={idx} id="outlined-basic" label="First Name" variant="outlined" value={entity.profile!.last_name} />
      }
    },
    {
      name: 'join_date', label: 'Join Date', type: 'date', disabled: false
    },
    {
      name: "status",
      label: 'Status',
      type: 'select',
      options: [
        { label: 'New Prospect', value: "new prospect" },
        { label: 'Cadre', value: "Cadre" },
        { label: 'Contributor', value: "Contributor" },
        { label: 'Board only', value: "Board only" },
        { label: 'Past', value: "past" },
        { label: 'Rejected', value: "rejected" },
        { label: 'On Break', value: "taking a break" },
        { label: 'On Call', value: "on call" },
        { label: 'Offboarding Cadre', value: "Offboarding Cadre" },
        { label: 'Offboarding Contributor', value: "Offboarding Contributor" },
        { label: 'Onboarding', value: "Onboarding" },
      ],
      disabled: false,
    },
    {
      name: "linkedin",
      label: 'LinkedIn',
      type: 'string',
      disabled: false,
    },
  ] as InputOption[];

  function handleChange(field: string, value: any) {
    // stringify & parse needed for string keys
    const updatedChanges = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
    console.log(updatedChanges)
    // setProject({
    //   ...project,
    //   ...updatedChanges
    // });
    // setDirty(true);
  }
  return (entity &&
    <Stack gap={1} >
      <Card >
        <CardContent>
          <InputForm entity={entity} inputFields={fields} onChange={handleChange} />
        </CardContent>
      </Card>
      <TeamsCard entity={entity} onChange={onChange} />
      <DisciplinesCard entity={entity} onChange={onChange} />
      <ToolsCard entity={entity} onChange={onChange} />
      <VenturesCard entity={entity} onChange={onChange} />
    </Stack>
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

