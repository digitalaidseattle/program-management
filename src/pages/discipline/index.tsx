
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
import { EditField } from '../../components/EditField';
import { EntityProps } from '../../components/utils';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { VolunteersCard } from './VolunteersCard';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)" };

const DisciplineDetails: React.FC<EntityProps<Discipline>> = ({ entity, onChange }) => {

  function update(field: string, value: string): void {
    const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
    disciplineService.update(entity.id, changes)
      .then(updated => {
        onChange(updated);
      });
  }

  return (entity &&
    <>
      <Card sx={{ padding: 0 }}>
        <CardHeader
          title={
            <EditField
              value={entity.name}
              display={entity.name}
              onChange={(updated: string) => update('name', updated)} />
          }
        />

        <CardContent>
          <EditField
            value={entity.details}
            multiline={true}
            header='Details'
            display={<Markdown>{entity.details ?? 'N/A'}</Markdown>}
            onChange={(newText) => update('details', newText)} />

        </CardContent>
      </Card >
      <VolunteersCard entity={entity} onChange={onChange} />
    </>
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

