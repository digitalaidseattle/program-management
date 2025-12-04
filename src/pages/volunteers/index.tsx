
// material-ui
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNotifications, useStorageService } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Toolbar,
  Tooltip
} from '@mui/material';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { addVolunteer } from '../../actions/AddVolunteer';
import { deleteVolunteers } from '../../actions/DeleteVolunteers';
import { EntityTable } from '../../components/EntityTable';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import VolunteerDialog from './VolunteerDialog';

const VolunteersPage = () => {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>();
  const [queryModel, setQueryModel] = useState<QueryModel>();

  const [pageInfo, setPageInfo] = useState<PageInfo<Volunteer>>({ rows: [], totalRowCount: 0 });
  const storageService = useStorageService()!;

  useEffect(() => {
    fetchData();
  }, [queryModel]);

  const columns: GridColDef<Volunteer[][number]>[] = [
    {
      field: 'profile.pic',
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
            alt={params.row.profile ? params.row.profile.name : ''}
            src={storageService.getUrl(`profiles/${params.row.profile!.id}`)}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'profile.name', headerName: 'Name', width: 175,
      renderCell: (params) => params.row.profile!.name
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      valueGetter: (value) => value
    },
    {
      field: 'das_email',
      headerName: 'DAS Email',
      width: 250,
    },
    {
      field: 'github',
      headerName: 'Github',
      width: 200,
    },
    {
      field: 'linkedin',
      headerName: 'Linked In',
      width: 250,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 300,
    }
  ];

  function fetchData() {
    if (queryModel) {
      volunteerService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function isDeleteDisabled() {
    return selectionModel
      ? selectionModel.ids!.size === 0 && selectionModel.type === 'include'
      : true;
  }

  function toolbar() {
    return (
      <Stack direction='row' alignItems={'center'}>
        <Toolbar>
          <IconButton color='primary' onClick={() => setShowAddDialog(true)}><PlusCircleOutlined /></IconButton>
        </Toolbar>
        <Tooltip title="Remove Volunteer">
          <Box>
            <IconButton color="primary"
              disabled={isDeleteDisabled()}
              onClick={() => setShowDeleteDialog(true)} >
              <DeleteOutlined />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
    );
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/data/volunteer/${event.id}`)
  }

  function handleAdd(volunteer: Volunteer | null): void {
    if (volunteer && volunteer.profile) {
      addVolunteer(volunteer)
        .then(() => navigate(`/data/volunteer/${volunteer.id}`));
    }
    setShowAddDialog(false);
  }

  function handleDelete(): void {
    if (selectionModel) {
      deleteVolunteers([...selectionModel.ids] as string[])
        .then(() => {
          notifications.success('Volunteers deleted successfully.');
          fetchData();
        })
        .finally(() => setShowDeleteDialog(false))
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Volunteers" />
        <CardContent>
          <EntityTable
            pageInfo={pageInfo}
            onChange={setQueryModel}
            columns={columns}
            toolbar={toolbar}
            onRowDoubleClick={handleRowDoubleClick}
            onSelect={setSelectionModel}
          />
        </CardContent>
      </Card>
      <VolunteerDialog
        open={showAddDialog}
        title={'Add Volunteer'}
        entity={volunteerService.empty()}
        handleSuccess={handleAdd}
        handleError={() => { }}
      />
      <ConfirmationDialog
        open={showDeleteDialog}
        message={'Are you sure?'}
        handleCancel={() => setShowDeleteDialog(false)}
        handleConfirm={() => handleDelete()}
      />
    </>
  );
};

export default VolunteersPage;
