
// material-ui
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Avatar, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { SupabaseStorage } from '../../services/supabaseStorage';
import { VolunteerDetails } from '../volunteer';
import { DisciplineDetails } from '../discipline';

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

  function refreshEntity(entity: Discipline) {
    console.log(entity)
    alert('nrfpt');
  }

  return (
    <ListDetailPage
      title='Disciplines'
      pageInfo={pageInfo}
      columns={columns}
      onChange={onChange}
      tableOpts={
        { onRowDoubleClick: handleRowDoubleClick }
      }
      gridOpts={{
        cardRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={supabaseStorage.getUrl(`icons/${entity.id}`)} />
      }}
      listOpts={{
        listItemRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={supabaseStorage.getUrl(`icons/${entity.id}`)} />,
        detailRenderer: entity => <DisciplineDetails entity={entity} onChange={entity => refreshEntity(entity)} />,
      }}
    />
  );
};


export default DisciplinesPage;
