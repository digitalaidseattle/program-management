
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Avatar, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { DisciplineDetails } from '../discipline';


const DisciplinesPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Discipline>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  const storageService = useStorageService()!;

  const columns: GridColDef<Discipline[][number]>[] = [
    {
      field: 'icon',
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
            src={disciplineService.getIconUrl(params.row)}
            alt={`${params.row.name} icon`}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />
        </Box>
      ),
    },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'details', headerName: 'Details', width: 800 },

  ];

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      disciplineService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/data/discipline/${event.id}`)
  }

  function refreshEntity(entity: Discipline) {
    console.log(entity)
  }

  return (
    <ListDetailPage
      title='Disciplines'
      pageInfo={pageInfo}
      onChange={onChange}
      tableOpts={
        {
          columns: columns,
          onRowDoubleClick: handleRowDoubleClick
        }
      }
      gridOpts={{
        cardRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storageService.getUrl(`icons/${entity.id}`)} />
      }}
      listOpts={{
        listItemRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storageService.getUrl(`icons/${entity.id}`)} />,
        detailRenderer: entity => <DisciplineDetails entity={entity} onChange={entity => refreshEntity(entity)} />,
      }}
    />
  );
};

export default DisciplinesPage;
