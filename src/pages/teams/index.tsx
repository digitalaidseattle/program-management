
// material-ui
import { GridColDef } from '@mui/x-data-grid';
import ListDetailPage from '../../components/ListDetailPage';
import { Team, teamService } from '../../services/dasTeamService';
import { TeamCard } from '../../components/TeamCard';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router';


const columns: GridColDef<Team[][number]>[] = [

  { field: 'team_name', headerName: 'Name', width: 200 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
  },
  {
    field: 'slack_channel',
    headerName: 'Slack',
    width: 150,
  },
  {
    field: 'purpose',
    headerName: 'Purpose',
    width: 150,
  }
];

const TeamsPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Team>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      teamService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/team/${event.id}`)
  }

  return (
    <ListDetailPage
      pageInfo={pageInfo}
      title='Teams'
      columns={columns}
      onChange={onChange}
      cardRenderer={entity => <TeamCard key={entity.id} entity={entity} />}
      onRowDoubleClick={handleRowDoubleClick}
    />
  );
};

export default TeamsPage;
