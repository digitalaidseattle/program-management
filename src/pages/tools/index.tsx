
// material-ui
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Avatar, Box, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import ListDetailPage from '../../components/ListDetailPage';
import { Tool, toolService } from '../../services/dasToolsService';

const ToolsPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Tool>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

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
            src={toolService.getLogoUrl(params.row)}
            alt={params.row.name}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />
        </Box>
      ),
    },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'status', headerName: 'Status', width: 200,
      renderCell: (params) => (
         <Chip label={params.row.status} color={params.row.status === 'active' ? 'success' : 'error'} />
      ),
    },
   

    { field: 'description', headerName: 'Description', width: 800 },

  ];

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      toolService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/data/tool/${event.id}`)
  }

  return (
    <ListDetailPage
      title='Tools'
      pageInfo={pageInfo}
      onChange={onChange}
      tableOpts={
        {
          columns: columns,
          onRowDoubleClick: handleRowDoubleClick
        }
      }
    />
  );
};

export default ToolsPage;
