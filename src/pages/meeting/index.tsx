
// material-ui
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import { useContext, useEffect, useState } from 'react';

import { UserContext } from '@digitalaidseattle/core';
import dayjs from 'dayjs';
import { useParams } from 'react-router';
import { TabbedPanels } from '../../components/TabbedPanelsCard';
import { EntityProps } from '../../components/utils';
import { Meeting, meetingService, MeetingTopic, meetingTopicService } from '../../services/dasMeetingService';
import { AttendeesCard } from './AttendeesCard';
import { ShoutoutsCard } from './ShoutoutsCard';
import { TopicsCard } from './TopicsCard';


function IntrosCard<T>({ entity: meeting, onChange }: EntityProps<Meeting>) {

  return (
    <Card>
      <CardHeader title='Attendees Card' />
    </Card>
  );
}

const AnniversariesCard: React.FC<EntityProps<Meeting>> = ({ entity: meeting, onChange }) => {
  return (
    <Card>
      <CardHeader title='Attendees Card' />
    </Card>
  );
}

const DetailsCard: React.FC<EntityProps<Meeting>> = ({ entity: meeting, onChange }) => {
  const [iceBreakerTopic, setIceBreaker] = useState<MeetingTopic>();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (meeting) {
      setIceBreaker((meeting.meeting_topic ?? []).find(t => t.type === 'icebreaker'))
    }
  }, [meeting])

  function handleIcebreakerChange(field: keyof MeetingTopic, description: string): void {
    if (iceBreakerTopic) {
      const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(description)} }`)
      meetingTopicService.update(iceBreakerTopic.id, changes)
        .then(updated => onChange(updated))
    } else {
      const topic = meetingTopicService.empty(meeting.id);
      topic.type = 'icebreaker';
      topic.description = description;
      topic.created_by = user?.email!;
      meetingTopicService.insert(topic)
        .then(inserted => onChange(inserted))
    }
  }

  function handleMeetingChange(field: keyof Meeting, value: any): void {
    const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
    meetingService.update(meeting.id, changes)
      .then(updated => onChange(updated))
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack gap={2}>
            <FormControl fullWidth >
              <TextField
                id={'name'}
                name={'name'}
                type="text"
                label={'Name'}
                rows={1}
                value={meeting.name}
                fullWidth
                variant="outlined"
                onChange={(evt) => handleMeetingChange('name', evt.target.value)}
              />
            </FormControl>
            <DatePicker
              label='Meeting Date'
              value={dayjs(meeting.date)}
              onChange={(value) => handleMeetingChange('date', value!.toDate())} />
            <FormControl fullWidth >
              <TextField
                id={'icebreaker'}
                name={'icebreaker'}
                type="text"
                label={'Ice Breaker'}
                rows={1}
                value={iceBreakerTopic ? iceBreakerTopic.description : ''}
                fullWidth
                variant="outlined"
                onChange={(evt) => handleIcebreakerChange('description', evt.target.value)}
              />
            </FormControl>
          </Stack>
        </CardContent>
      </Card>
    </>);
}

const MeetingDetails: React.FC<EntityProps<Meeting>> = ({ entity: meeting, onChange }) => {
  return (meeting &&
    <>
      <Typography variant='h2'>{meeting.name}</Typography>
      <TabbedPanels panels={[
        { header: 'Details', children: <DetailsCard entity={meeting} onChange={onChange} /> },
        { header: 'Shout Outs', children: <ShoutoutsCard entity={meeting} onChange={onChange} /> },
        { header: 'Topics', children: <TopicsCard entity={meeting} onChange={onChange} /> },
        { header: 'Attendees', children: <AttendeesCard entity={meeting} onChange={onChange} /> },
        { header: 'Intros', children: <IntrosCard entity={meeting} onChange={onChange} /> },
        { header: 'Anniversaries', children: <AnniversariesCard entity={meeting} onChange={onChange} /> }
      ]} />
    </>
  )
}

const MeetingPage = () => {
  const [entity, setEntity] = useState<Meeting>();
  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      refresh();
    }
  }, [id]);

  function refresh() {
    if (id) {
      meetingService.getById(id)
        .then((en) => {
          console.log(en)
          setEntity(en!)
        });
    }
  }

  return (entity &&
    <Stack gap={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/meetings">
          Meetings
        </Link>
        <Typography>Meeting Name</Typography>
      </Breadcrumbs>
      <MeetingDetails entity={entity} onChange={() => refresh()} />
    </Stack>
  )
}

export { MeetingDetails, MeetingPage };
