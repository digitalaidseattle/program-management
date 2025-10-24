
// material-ui
import { Avatar, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import ListDetailPage from '../../components/ListDetailPage';
import { DisciplineCard } from './DisciplineCard';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { SupabaseStorage } from '../../services/supabaseStorage';

const supabaseStorage = new SupabaseStorage();

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
          src={supabaseStorage.getUrl(`icons/${params.row.id}`)}
          alt={`${params.row.name} icon`}
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
      tableOpts={
        { onRowDoubleClick: handleRowDoubleClick }
      }
      gridOpts={{ cardRenderer: entity => <DisciplineCard entity={entity} /> }}

    />
  );
};


export default DisciplinesPage;
