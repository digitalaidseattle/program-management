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
  Grid,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { EntityProps } from '../../components/utils';
import { Profile, profileService } from '../../services/dasProfileService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { DisciplinesCard } from './DisplinesCard';
import { TeamsCard } from './TeamsCard';
import { ToolsCard } from './ToolsCard';
import { VenturesCard } from './VenturesCard';
import { UploadImage } from '../../components/UploadImage';
import { storageService } from '../../App';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)" }

const VolunteerDetails: React.FC<EntityProps<Volunteer>> = ({ entity, onChange }) => {
  const [volunteer, setVolunteer] = useState<Volunteer>();

  useEffect(() => {
    setVolunteer(entity);
  }, [entity]);

  const fields = [
    {
      name: 'profile.name', label: 'Name', type: 'custom', disabled: true,
      inputRenderer: (idx: number, _optio: InputOption, _value: any) => {
        return <TextField key={idx} id="outlined-basic" label="Name"
          disabled={true}
          variant="outlined" value={entity.profile!.name} />
      }
    },
    {
      name: 'profile.first_name', label: 'First Name', type: 'custom', disabled: false,
      inputRenderer: (idx: number, _optio: InputOption, _value: any) => {
        return <TextField key={idx} id="outlined-basic" label="First Name" variant="outlined"
          value={entity.profile!.first_name}
          onChange={(evt) => handleChange('profile.first_name', evt.target.value)} />
      }
    },
    {
      name: 'profile.last_name', label: 'Last Name', type: 'custom', disabled: false,
      inputRenderer: (idx: number, _optio: InputOption, _value: any) => {
        return <TextField key={idx}
          id="outlined-basic"
          label="First Name"
          variant="outlined"
          value={entity.profile!.last_name}
          onChange={(evt) => handleChange('profile.last_name', evt.target.value)} />
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
    if (volunteer) {
      const attrs = field.split('.');
      if (attrs[0] === 'profile') {
        let profileChanges: Partial<Profile> = {};
        if (attrs[1] === 'last_name') {
          profileChanges = {
            'last_name': value,
            'name': `${volunteer.profile!.first_name} ${value}`
          }
        }
        if (attrs[1] === 'first_name') {
          profileChanges = {
            'first_name': value,
            'name': `${value} ${volunteer.profile!.last_name}`
          }
        }
        profileService.update(volunteer.profile!.id, profileChanges)
          .then(() => volunteerService.getById(volunteer.id)
            .then(refreshed => onChange(refreshed)));
      } else {
        const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`);
        volunteerService.update(volunteer.id, changes)
          .then(updated => onChange(updated));
      }
    }
  }

  function handlePicChange(files: File[]) {
    if (volunteer) {
      files.forEach((file: File) => {
        const current = volunteer.profile!.pic ? volunteer.profile!.pic.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        const location = `profiles/${volunteer.profile!.id}:${idx}`;
        storageService.upload(location, file)
          .then(() => {
            profileService.update(volunteer.profile!.id, { pic: location })
              .then(() => volunteerService.getById(volunteer.id)
                .then(refreshed => onChange(refreshed)));
          })
      })
    }
  }

  function getPicUrl(volunteer: Volunteer): string | undefined {
    return volunteer.profile!.id ? storageService.getUrl(`profiles/${volunteer.profile!.id}`) : undefined
  }

  return (volunteer &&
    <Stack gap={1} >
      <Card >
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={3}>
              <UploadImage url={getPicUrl(volunteer)} onChange={(files) => handlePicChange(files)} />
            </Grid>
            <Grid size={9}>
              <InputForm entity={volunteer} inputFields={fields} onChange={handleChange} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <TeamsCard entity={volunteer} onChange={onChange} />
      <DisciplinesCard entity={volunteer} onChange={onChange} />
      <ToolsCard entity={volunteer} onChange={onChange} />
      <VenturesCard entity={volunteer} onChange={onChange} />
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
        <Link color="inherit" href="/data/volunteers">
          Volunteers
        </Link>
        <Typography>{entity.profile!.name}</Typography>
      </Breadcrumbs>
      <VolunteerDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}

export { VolunteerDetails, VolunteerPage };

