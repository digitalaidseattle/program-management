
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
import { Meeting, meetingService } from '../../services/dasMeetingService';


const MeetingPage = () => {
  const [entity, setEntity] = useState<Meeting>();
  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      meetingService.getById(id)
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
        <Link color="inherit" href="/meetings">
          Meetings
        </Link>
        <Typography>Meeting Name</Typography>
      </Breadcrumbs>
      <Typography variant='h2'>Meeting Name</Typography>
      <Card>
        <CardHeader title='Ice breaker' />
        <CardContent>
          <Markdown></Markdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title='Attendees' />
        <CardContent>
          <Markdown>check list</Markdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title='Agenda' />
        <CardContent>
          <Markdown>check list</Markdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title='Topics' />
        <CardContent>
          <Markdown>check list</Markdown>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default MeetingPage;
