
// material-ui
import { useStorageService } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { Avatar, Box, Chip, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ListCard } from '../../components/ListCard';
import ListDetailPage from '../../components/ListDetailPage';
import { Venture, ventureService } from '../../services/dasVentureService';
import { VentureDetails } from '../venture';
import { STATUS_COMP } from './Utils';

const VenturesPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Venture>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();
  const storageService = useStorageService()!;

  const columns: GridColDef<Venture[][number]>[] = [
    {
      field: 'logo',
      headerName: '',
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
            src={storageService.getUrl(`logos/${params.row.partner_id}`)}
            alt={`${params.row.partner!.name} logo`}
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            variant="rounded"
          />
        </Box>
      ),
    },
    { field: 'venture_code', headerName: 'Title', width: 300 },
    {
      field: 'status', headerName: 'Status', width: 200,
      renderCell: (params) => (
        params.row.status ? STATUS_COMP[params.row.status] : <Chip label='N/A' color='default' />
      ),
    },
    {
      field: 'partner.name', headerName: 'Partner', width: 200,
      renderCell: (params) => params.row.partner!.name
    },
    { field: 'painpoint', headerName: 'Painpoint', width: 200 },
  ];

  function onChange(_queryModel?: QueryModel) {
    // if (queryModel) {
    //   ventureService.find(queryModel)
    //   .then(pageInfo => {
    //     console.log(pageInfo)
    //     setPageInfo(pageInfo)
    //   })
    // }

    ventureService.getAll()
      .then(data => {
        setPageInfo({ rows: data, totalRowCount: data.length })
      })
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/venture/${event.id}`)
  }

  return (
    <ListDetailPage
      title='Ventures'
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
          title={entity.venture_code}
          avatarImageSrc={storageService.getUrl(`logos/${entity.partner!.id}`)}
          cardAction={() => handleRowDoubleClick({ id: entity.id })}
          cardContent={
            <Stack>
              {entity.status ? STATUS_COMP[entity.status] : <Chip label='N/A' color='default' />}
            </Stack>
          }
        />
      }}
      listOpts={{
        listItemRenderer: entity => <ListCard
          key={entity.id}
          title={entity.venture_code}
          avatarImageSrc={storageService.getUrl(`logos/${entity.partner!.id}`)} />,
        detailRenderer: entity => <VentureDetails entity={entity} onChange={() => alert('nrfpt')} />,
      }}

    />
  );
};


export default VenturesPage;
