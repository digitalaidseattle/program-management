
// material-ui
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Button, ButtonGroup, Stack, Toolbar, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createPlenaryMeeting } from '../../actions/CreatePlenary';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Meeting, meetingService } from '../../services/dasMeetingService';
import { Team, teamService } from '../../services/dasTeamService';
import { MeetingDetails } from '../meeting';
import SelectItemDialog from '../../components/SelectItemDialog';
import { createTeamMeeting } from '../../actions/CreateTeamMeeting';

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

function MeetingToolbar(): ReactNode {
  const [teams, setTeams] = useState<Team[]>([]);
  const [openTeamDialog, setOpenTeamDialog] = useState<boolean>(false);
  const navigate = useNavigate();


  useEffect(() => {
    teamService.getAll()
      .then(ts => setTeams(ts.sort((a, b) => a.name.localeCompare(b.name))));
  }, []);


  async function newPlenary() {
    const meeting = await createPlenaryMeeting();
    if (meeting) {
      navigate(`/meeting/${meeting.id}`)
    }
  }

  function handleSelectTeam(selection: string | null | undefined): any {
    if (selection) {
      const team = teams.find(t => t.id === selection)
      if (team) {
        createTeamMeeting(team)
          .then(meeting => {
            if (meeting) {
              navigate(`/meeting/${meeting.id}`)
            }
          })
          .finally(() => setOpenTeamDialog(false));
      }
    }
  }

  return (
    <Stack direction='row' alignItems={'center'}>

      <Toolbar sx={{ gap: 1 }}>
        <Typography>Add:</Typography>
        <ButtonGroup size="small" sx={{ height: 30 }} aria-label="outlined primary button group">
          <Button onClick={() => newPlenary()}>Plenary</Button>
          <Button onClick={() => alert('Not ready')}>Leadership</Button>
          <Button onClick={() => setOpenTeamDialog(true)}>Team</Button>
          <Button onClick={() => alert('Not ready')}>Adhoc</Button>
        </ButtonGroup>
      </Toolbar>
      <SelectItemDialog
        options={{
          title: 'Select Team'
        }}
        open={openTeamDialog}
        records={teams.map(t => ({ label: t.name, value: t.id }))}
        onSubmit={handleSelectTeam}
        onCancel={() => setOpenTeamDialog(false)} />
    </Stack>
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
