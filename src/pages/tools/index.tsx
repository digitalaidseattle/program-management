
// material-ui
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Avatar, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Tool, toolService } from '../../services/dasToolsService';
import { SupabaseStorage } from '../../services/supabaseStorage';
import { ToolDetails } from '../tool';

const supabaseStorage = new SupabaseStorage();

const columns: GridColDef<Tool[][number]>[] = [
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
          src={supabaseStorage.getUrl(`logos/${params.row.id}`)}
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

const storage = new SupabaseStorage();

const ToolsPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Tool>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      toolService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/tool/${event.id}`)
  }

  return (
    <ListDetailPage
      pageInfo={pageInfo}
      title='Tools'
      columns={columns}
      onChange={onChange}
      tableOpts={
        { onRowDoubleClick: handleRowDoubleClick }
      }
      gridOpts={{
        cardRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storage.getUrl(`/logos/${entity.id}`)}
          cardAction={() => handleRowDoubleClick({ id: entity.id })}
        />
      }}
      listOpts={{
        listItemRenderer: entity => <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={storage.getUrl(`/logos/${entity.id}`)} />,
        detailRenderer: entity => <ToolDetails entity={entity} onChange={() => alert('nrfpt')} />,
      }}
    />
  );
};

export default ToolsPage;
