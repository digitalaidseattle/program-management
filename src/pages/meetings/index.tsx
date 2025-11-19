
// material-ui
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AddMeetingDialog from '../../components/AddMeetingDialog';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Meeting, meetingService } from '../../services/dasMeetingService';
import { Team, teamService } from '../../services/dasTeamService';
import { MeetingDetails } from '../meeting';
import { useNotifications } from '@digitalaidseattle/core';
import { PlusCircleOutlined } from '@ant-design/icons';

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
  const notification = useNotifications();

  const [showAddMeetingDialog, setShowAddMeetingDialog] = useState<boolean>(false);

  function handleClose(evt: any) {
    if (evt.meeting) {
      notification.success('Meeting added.');
      navigate(`/meeting/${evt.meeting.id}`);
    }
    setShowAddMeetingDialog(false);
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
    navigate(`/meeting/${event.id}`)
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
