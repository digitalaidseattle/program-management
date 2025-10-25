
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
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { VolunteersCard } from './VolunteersCard';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)" };

const DisciplineDetails: React.FC<EntityProps<Discipline>> = ({ entity, onChange }) => {

  return (entity &&
    <Stack gap={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/disciplines">
          Disciplines
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <Typography variant='h2'>{entity.name}</Typography>
      <Card>
        <CardHeader title="Details" />
        <CardContent>
          <Markdown>{entity.details}</Markdown>
        </CardContent>
      </Card>
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
    <DisciplineDetails entity={entity} onChange={refresh} />
  )
}

export { DisciplineDetails, DisciplinePage };

