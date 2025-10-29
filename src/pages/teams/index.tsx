
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Avatar, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Team, teamService } from '../../services/dasTeamService';
import { TeamDetails } from '../team';



const TeamsPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Team>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();
  const storageService = useStorageService()!;

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
            src={storageService.getUrl(`icons/${params.row.id}`)}
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
      onChange={onChange}
      gridOpts={{
        cardRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storageService.getUrl(`/icons/${entity.id}`)}
          cardAction={() => handleRowDoubleClick({ id: entity.id })}
        />
      }}
      tableOpts={
        {
          columns: columns,
          onRowDoubleClick: handleRowDoubleClick
        }
      }
      listOpts={{
        listItemRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storageService.getUrl(`/icons/${entity.id}`)} />,
        detailRenderer: entity => <TeamDetails entity={entity} onChange={() => alert('nrfpt')} />,
      }}

    />
  );
};

export default TeamsPage;
