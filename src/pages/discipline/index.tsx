
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
import { VolunteerCard } from '../../components/VolunteerCard';
import { EntityProps } from '../../components/utils';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { Volunteer2Discipline, volunteer2DisciplineService } from '../../services/dasVolunteer2DisciplineService';

const VolunteersCard: React.FC<EntityProps<Discipline>> = ({ entity }) => {
  const [current, setCurrent] = useState<Volunteer2Discipline[]>([]);

  useEffect(() => {
    if (entity) {
      volunteer2DisciplineService.findByDisciplineId(entity.id)
        .then((v2ds) => {
          setCurrent(v2ds)
        });
    }
  }, [entity]);

  return (< >
    <ManagedListCard
      title='Volunteers'
      items={current.map(v2d => <VolunteerCard key={v2d.volunteer_id}
        entity={v2d.volunteer!}
        highlightOptions={{
          title: "Senior",
          highlight: v2d.senior ?? false,
        }}
        cardStyles={{ width: 200 }} />)}
      cardHeaderSx={{
        background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)"
      }}
    />
  </>)
}

const DisciplinePage = () => {
  const [entity, setEntity] = useState<Discipline>();
  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      disciplineService.getById(id)
        .then((en) => {
          console.log(en)
          setEntity(en!)
        });
    }
  }, [id]);

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
      <VolunteersCard entity={entity} onChange={() => alert('not implemented!')} />
    </Stack>
  )
}

export default DisciplinePage;
