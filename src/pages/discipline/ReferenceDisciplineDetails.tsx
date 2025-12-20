
/**
 *  ReferenceDisciplineDetails.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { StarFilled, StarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router';

import { storageService } from '../../App';
import { ManagedListCard } from '../../components/ManagedListCard';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { volunteer2DisciplineService } from '../../services/dasVolunteer2DisciplineService';
import { Volunteer } from '../../services/dasVolunteerService';

type VolunteerWithSenior = Volunteer & {
  senior: boolean;
}

const ReferenceDisciplineDetails = ({ entity }: { entity: Discipline }) => {
  const navigate = useNavigate();

  const [volunteerCards, setVolunteerCards] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (entity) {
      volunteer2DisciplineService.findByDisciplineId(entity.id)
        .then(v2ds => {
          setVolunteerCards(v2ds
            .filter(v2d => ['Cadre', 'Contributor'].includes(v2d.volunteer!.status))
            .sort((v1, v2) => v1.volunteer!.profile!.last_name.localeCompare(v2.volunteer!.profile!.last_name))
            .map(v2d => createVolunteerCard({ ...v2d.volunteer!, senior: v2d.senior })))
        })
    }
  }, [entity]);

  function createVolunteerCard(volunteer: VolunteerWithSenior) {
    // FIXME navigate to reference page /volunteer
    const navUrl = `/data/volunteer/${volunteer.id}`;
    // FIXME migrate to profile.pic
    const picUrl = storageService.getUrl(`profiles/${volunteer.profile!.id}`);

    const seniorStar = volunteer.senior
      ? <StarFilled style={{ color: '#bea907ff' }} />
      : <StarOutlined style={{ color: 'gray' }} />
    return <Card key={volunteer.id}
      sx={{ width: 240, height: "100%" }}>
      <CardActionArea onClick={() => navigate(navUrl)}>
        <CardHeader
          title={volunteer.profile!.name}
          subheader={volunteer.position}
          action={
            <Tooltip title='Senior'>
              {seniorStar}
            </Tooltip>
          }
          avatar={<Avatar
            src={picUrl}
            alt={`${entity.name} icon`}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />
          }
        />
      </CardActionArea>
    </Card>
  }

  const statusChip = entity.status === 'Public'
    ? <Chip label={entity.status} variant="outlined" color="success" />
    : entity.status === 'Internal'
      ? <Chip label={entity.status} variant="outlined" color="primary" />
      : null

  return (entity &&
    <Stack gap={2}>
      <Card>
        <CardHeader
          slotProps={{ title: { fontSize: 16, fontWeight: 600 } }}
          title={entity.name}
          avatar={<Avatar
            src={disciplineService.getIconUrl(entity)}
            alt={entity.name}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />}
          action={statusChip}
        />

        <CardContent>
          <Markdown>{entity.details}</Markdown>
        </CardContent>
      </Card >
      <ManagedListCard title={'Volunteers'} items={volunteerCards} />
    </Stack>
  )
}


export { ReferenceDisciplineDetails };

