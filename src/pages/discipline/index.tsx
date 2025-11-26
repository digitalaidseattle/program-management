
/**
 *  discipline/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
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
import Markdown from 'react-markdown';
import { useParams } from 'react-router';

import { storageService } from '../../App';
import { EditField } from '../../components/EditField';
import { UploadImage } from '../../components/UploadImage';
import { EntityProps } from '../../components/utils';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { VolunteersCard } from "./VolunteersCard";
import { InputForm, InputOption } from '@digitalaidseattle/mui';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)" };

const DisciplineDetails: React.FC<EntityProps<Discipline>> = ({ entity, onChange }) => {

  const fields = [
    {
      name: 'status', label: 'Status', type: 'select',
      options: [
        { label: 'Public', value: 'Public' },
        { label: 'Internal', value: 'Internal' }
      ]
    },
    {
      name: 'details', label: 'Detail', type: 'string', size: 12
    },
    {
      name: 'slack', label: 'Slack', type: 'string'
    }

  ] as InputOption[];

  function handleChange(field: string, value: string): void {
    const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
    disciplineService.update(entity.id, changes)
      .then(updated => {
        onChange(updated);
      });
  }

  function handlePicChange(files: File[]) {
    if (entity) {
      files.forEach((file: File) => {
        const location = disciplineService.getNextLocation(entity);
        storageService.upload(location, file)
          .then(() => {
            disciplineService.update(entity.id, { icon: location })
              .then(updated => disciplineService.getById(updated.id)
                .then(refreshed => onChange(refreshed)));
          })
      })
    }
  }

  return (entity &&
    <Stack>
      <Card sx={{ padding: 0 }}>
        <CardHeader
          title={
            <EditField
              value={entity.name}
              display={entity.name}
              onChange={(updated: string) => handleChange('name', updated)} />
          }
        />
        <CardContent>
          <Grid container>
            <Grid size={3}>
              <UploadImage
                url={disciplineService.getIconUrl(entity)}
                onChange={handlePicChange} />
            </Grid>
            <Grid size={9}>
              <InputForm entity={entity} inputFields={fields} onChange={handleChange} />
            </Grid>
          </Grid>
        </CardContent>
      </Card >
      <VolunteersCard entity={entity} onChange={onChange} />
    </Stack>
  )
}

const DisciplinePage = () => {
  const [entity, setEntity] = useState<Discipline>();
  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      refresh()
    }
  }, [id]);

  function refresh() {
    if (id) {
      disciplineService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/data/disciplines">
          Disciplines
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <DisciplineDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}

export { DisciplineDetails, DisciplinePage };

