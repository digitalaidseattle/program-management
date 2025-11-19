
// material-ui
import { PlusCircleOutlined } from '@ant-design/icons';
import { useStorageService } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Toolbar,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { VolunteerCard } from '../../components/VolunteerCard';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { VolunteerDetails } from '../volunteer';

const VolunteersPage = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<PageInfo<Volunteer>>({ rows: [], totalRowCount: 0 });
  const storageService = useStorageService()!;

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

  function toolbar() {
    return (
      <Stack direction='row' alignItems={'center'}>
        <Toolbar>
          <IconButton color='primary' onClick={() => setShowDialog(true)}><PlusCircleOutlined /></IconButton>
        </Toolbar>
      </Stack>
    );
  }

  function onChange(queryModel?: QueryModel) {
    volunteerService.find(queryModel!)
      .then(pageInfo => setPageInfo(pageInfo))
  }

  const navigate = useNavigate();

  function handleRowDoubleClick(event: any) {
    navigate(`/data/volunteer/${event.id}`)
  }

  function refreshEntity(entity: Volunteer) {
    console.log(entity)
    alert('nrfpt');
  }

  return (
    <>
      <ListDetailPage
        title="Volunteers"
        pageInfo={pageInfo}
        toolbar={toolbar}
        onChange={onChange}
        tableOpts={
          {
            columns: columns,
            onRowDoubleClick: handleRowDoubleClick
          }
        }
        gridOpts={{ cardRenderer: entity => <VolunteerCard key={entity.id} entity={entity} /> }}
        listOpts={{
          listItemRenderer: entity => <ListCard
            key={entity.id}
            title={entity.profile!.name}
            avatarImageSrc={storageService.getUrl(`profiles/${entity.profile!.id}`)} />,
          detailRenderer: entity => <VolunteerDetails entity={entity} onChange={entity => refreshEntity(entity)} />,
        }}
      />
      <ConfirmationDialog
        open={showDialog}
        message='Add volunteer dialog goes here!'
        handleCancel={() => setShowDialog(false)}
        handleConfirm={() => setShowDialog(false)}
      />
    </>
  );
};

export default VolunteersPage;
