
// material-ui
import {
  Breadcrumbs,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useParams } from 'react-router';
import { EntityProps } from '../../components/utils';
import { Meeting, meetingService } from '../../services/dasMeetingService';
import { AnniversariesCard } from './AnniversaryCard';
import { AttendeesCard } from './AttendeesCard';
import { DetailsCard } from './DetailsCard';
import { IntrosCard } from './IntrosCard';
import { ShoutoutsCard } from './ShoutoutsCard';
import { TopicsCard } from './TopicsCard';
import { TabbedPanels } from '@digitalaidseattle/mui';

const MeetingDetails: React.FC<EntityProps<Meeting>> = ({ entity: meeting, onChange }) => {

  function getPanelsByType() {
    switch (meeting.type) {
      case 'plenary':
        return [
          { header: 'Details', children: <DetailsCard entity={meeting} onChange={onChange} /> },
          { header: 'Attendees', children: <AttendeesCard entity={meeting} onChange={onChange} /> },
          { header: 'Shout Outs', children: <ShoutoutsCard entity={meeting} onChange={onChange} /> },
          { header: 'Topics', children: <TopicsCard entity={meeting} onChange={onChange} /> },
          { header: 'Intros', children: <IntrosCard entity={meeting} onChange={onChange} /> },
          { header: 'Anniversaries', children: <AnniversariesCard entity={meeting} onChange={onChange} /> }
        ]
      default:
        return [
          { header: 'Details', children: <DetailsCard entity={meeting} onChange={onChange} /> },
          { header: 'Attendees', children: <AttendeesCard entity={meeting} onChange={onChange} /> },
          { header: 'Topics', children: <TopicsCard entity={meeting} onChange={onChange} /> },
        ]
    }
  }
  return (meeting &&
    <>
      <Typography variant='h2'>{meeting.name}</Typography>
      <TabbedPanels panels={getPanelsByType()} />
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
        .then((en) => setEntity(en!));
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
