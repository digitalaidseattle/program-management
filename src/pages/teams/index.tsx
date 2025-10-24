
// material-ui
import { GridColDef } from '@mui/x-data-grid';
import ListDetailPage from '../../components/ListDetailPage';
import { Team, teamService } from '../../services/dasTeamService';
import { TeamCard } from '../../components/TeamCard';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Box } from '@mui/material';
import { SupabaseStorage } from '../../services/supabaseStorage';
import { ListItem } from './ListItem';
import { TeamDetails } from '../team';

const supabaseStorage = new SupabaseStorage();

const columns: GridColDef<Team[][number]>[] = [
  {
    field: 'logo',
    headerName: '',
    width: 100,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Avatar
          src={supabaseStorage.getUrl(`icons/${params.row.id}`)}
          alt={`${params.row.name} icon`}
          sx={{ width: 40, height: 40, objectFit: 'contain' }}
          variant="rounded"
        />
      </Box>
    ),
  },
  { field: 'name', headerName: 'Name', width: 200 },
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
      gridOpts={{ cardRenderer: entity => <TeamCard key={entity.id} entity={entity} /> }}
      tableOpts={
        { onRowDoubleClick: handleRowDoubleClick }
      }
      listOpts={{
        listItemRenderer: entity => <ListItem entity={entity} />,
        detailRenderer: entity => <TeamDetails entity={entity} onChange={() => alert('nrfpt')}/>,
      }}

    />
  );
};

export default TeamsPage;
