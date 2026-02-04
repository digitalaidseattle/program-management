/**
 *  RolesPage.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Avatar, Box, Rating } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EntityTable } from '../../components/EntityTable';
import { Role, roleService } from '../../services/dasRoleService';


const RolesPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Role>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();
  const storageService = useStorageService()!;

  const columns: GridColDef<Role[][number]>[] = [
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
            src={storageService.getUrl(params.row.pic!)}
            alt={params.row.name}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />
        </Box>
      ),
    },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'urgency', headerName: 'Urgency', width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Rating disabled={true} value={Number(params.row.urgency)} />
        </Box>
      )
    },
  ];

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      roleService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/data/role/${event.id}`)
  }

  return (
    <EntityTable
      columns={columns}
      pageInfo={pageInfo}
      onChange={onChange}
      onRowDoubleClick={handleRowDoubleClick} />
  );
};

export default RolesPage;
