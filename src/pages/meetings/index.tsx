
// material-ui
import { PlusCircleOutlined } from '@ant-design/icons';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { IconButton, Stack, Toolbar } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createPlenaryMeeting } from '../../actions/CreatePlenary';
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
    headerName: 'Status',
  },
  {
    field: 'meetingUrl',
    headerName: 'Google Meet',
    width: 300,
  },
];

const MeetingsPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Meeting>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  async function newPlenary() {
    const meeting = await createPlenaryMeeting();
    if (meeting) {
      navigate(`/meeting/${meeting.id}`)
    }
  }

  function toolbar() {
    return (
      <Stack direction='row' alignItems={'center'}>
        <Toolbar>
          <IconButton color='primary' onClick={() => newPlenary()}><PlusCircleOutlined /></IconButton>
        </Toolbar>
      </Stack>
    );
  }

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
      toolbar={toolbar}
      onChange={onChange}
      tableOpts={
        {
          columns: columns,
          onRowDoubleClick: handleRowDoubleClick
        }
      }
      gridOpts={{ cardRenderer: entity => <ListCard key={entity.id} title={`${entity.name} ${entity.date}`} /> }}
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
