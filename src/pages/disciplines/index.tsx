
// material-ui
import { Avatar, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import ListDetailPage from '../../components/ListDetailPage';
import { DisciplineCard } from './DisciplineCard';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';

const columns: GridColDef<Discipline[][number]>[] = [
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
          src={params.value}
          alt={params.row.name}
          sx={{ width: 40, height: 40, objectFit: 'contain' }}
          variant="rounded"
        />
      </Box>
    ),
  },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 800 },

];

const DisciplinesPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Discipline>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      disciplineService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/discipline/${event.id}`)
  }

  return (
    <ListDetailPage
      pageInfo={pageInfo}
      title='Disciplines'
      columns={columns}
      onChange={onChange}
      cardRenderer={entity => <DisciplineCard key={entity.id} entity={entity} />}
      onRowDoubleClick={handleRowDoubleClick}
    />
  );
};


export default DisciplinesPage;
