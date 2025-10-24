
// material-ui
import {
  Avatar,
  Box
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import ListDetailPage from '../../components/ListDetailPage';
import { partnerService, Partner } from '../../services/dasPartnerService';
import { PartnerCard } from './partnerCard';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SupabaseStorage } from '../../services/supabaseStorage';
import { PartnerDetails } from '../partner';
import { ListItem } from './ListItem';

const supabaseStorage = new SupabaseStorage();

const columns: GridColDef<Partner[][number]>[] = [
  {
    field: 'logo_url', headerName: '', width: 100,
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
  { field: 'name', headerName: 'Name', width: 300 },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
  },
  {
    field: 'gdrive_link',
    headerName: 'G-Drive',
    width: 200,
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
        <a href={params.value} target='_blank'> G-Drive</a>
      </Box>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
  },
];

const PartnersPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Partner>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      partnerService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/partner/${event.id}`)
  }

  return (
    <ListDetailPage
      pageInfo={pageInfo}
      title='Partners'
      columns={columns}
      onChange={onChange}
      tableOpts={
        { onRowDoubleClick: handleRowDoubleClick }
      }
      gridOpts={{ cardRenderer: entity => <PartnerCard entity={entity} /> }}
      listOpts={{
        listItemRenderer: entity => <ListItem entity={entity} />,
        detailRenderer: entity => <PartnerDetails entity={entity} onChange={() => alert('nrfpt')} />,
      }}
    />
  );
};


export default PartnersPage;
