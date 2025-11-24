
// material-ui
import { PlusCircleOutlined } from '@ant-design/icons';
import { useNotifications } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { IconButton, Stack, Toolbar } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import AddMeetingDialog from '../../components/AddMeetingDialog';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Meeting, meetingService } from '../../services/dasMeetingService';
import { MeetingDetails } from '../meeting';

const columns: GridColDef<Meeting[][number]>[] = [

  { field: 'name', headerName: 'Name', width: 300 },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
  },
  {
    field: 'date',
    headerName: 'Date',
  },
  {
    field: 'meeting_url',
    headerName: 'Google Meet',
    width: 300,
  },
];

function MeetingToolbar(): ReactNode {
  const navigate = useNavigate();
  const authService = useAuthService()

  useEffect(() => {
    teamService.getAll()
      .then(ts => setTeams(ts.sort((a, b) => a.name.localeCompare(b.name))));
  }, []);

  async function newPlenary() {
    const meeting = await createPlenaryMeeting();
    if (meeting) {
      navigate(`/data/meeting/${meeting.id}`)
    }
  }
  async function newLeadership() {
    const meeting = await createLeadershipMeeting();
    if (meeting) {
      navigate(`/data/meeting/${meeting.id}`)
    }
  }

  function handleSelectTeam(selection: string | null | undefined): any {
    if (selection) {
      const team = teams.find(t => t.id === selection)
      if (team) {
        createTeamMeeting(team)
          .then(meeting => {
            if (meeting) {
              navigate(`/data/meeting/${meeting.id}`)
            }
          })
          .finally(() => setOpenTeamDialog(false));
      }
    }
    setShowAddMeetingDialog(false);
  }

  async function newAdhoc() {
    const user = await authService.getUser();

    if (!user) {
      throw new Error(`User not logged in.`);
    }

    const volunteer = await volunteerService.findByDasEmail(user.email)
    if (!volunteer) {
      throw new Error(`Volunteer not found: ${user.email}`);
    }

    const meeting = await createAdhocMeeting(volunteer)
    if (!meeting) {
      throw new Error(`Cound not create the meeting`);
    }
    navigate(`/data/meeting/${meeting.id}`)
  }

  return (
    <Stack direction='row' alignItems={'center'}>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton onClick={() => setShowAddMeetingDialog(true)}><PlusCircleOutlined /></IconButton>
      </Toolbar>
      <AddMeetingDialog
        title={'Add meeting'}
        meetingTypes={['adhoc', 'team', 'leadership', 'plenary']}
        onClose={handleClose}
        open={showAddMeetingDialog} />
    </Stack >
  );
}

const MeetingsPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Meeting>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      meetingService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/data/meeting/${event.id}`)
  }

  return (
    <ListDetailPage
      title='Meetings'
      pageInfo={pageInfo}
      toolbar={() => <MeetingToolbar />}
      onChange={onChange}
      tableOpts={
        {
          columns: columns,
          onRowDoubleClick: handleRowDoubleClick
        }
      }
      gridOpts={{ cardRenderer: entity => <ListCard key={entity.id} title={`${entity.name} ${dayjs(entity.start_date).format('MM/DD/YYYY')}`} /> }}
      listOpts={{
        listItemRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name} />,
        detailRenderer: entity => <MeetingDetails entity={entity} onChange={() => alert('nrfpt')} />,
      }}
    />
  );
};


export default MeetingsPage;
