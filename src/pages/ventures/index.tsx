
// material-ui
import { GridColDef } from '@mui/x-data-grid';
import ListDetailPage from '../../components/ListDetailPage';
import { Venture, ventureService } from '../../services/dasVentureService';
import { VentureCard } from './VentureCard';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Box } from '@mui/material';
import { SupabaseStorage } from '../../services/supabaseStorage';
import { VentureDetails } from '../venture';

const supabaseStorage = new SupabaseStorage();

const columns: GridColDef<Venture[][number]>[] = [
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
          src={supabaseStorage.getUrl(`logos/${params.row.partner_id}`)}
          alt={`${params.row.partner!.name} logo`}
          sx={{ width: 40, height: 40, objectFit: 'contain' }}
          variant="rounded"
        />
      </Box>
    ),
  },
  { field: 'venture_code', headerName: 'Title', width: 300 },
  { field: 'status', headerName: 'Status', width: 200 },
  {
    field: 'partner.name', headerName: 'Partner', width: 200,
    renderCell: (params) => params.row.partner!.name
  },
  { field: 'painpoint', headerName: 'Painpoint', width: 200 },
];

const VenturesPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Venture>>({ rows: [], totalRowCount: 0 });
  const navigate = useNavigate();

  function onChange(queryModel?: QueryModel) {
    if (queryModel) {
      ventureService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
    } else {
      ventureService.getAll()
        .then(data => setPageInfo({ rows: data, totalRowCount: data.length }))
    }
  }

  function handleRowDoubleClick(event: any) {
    navigate(`/venture/${event.id}`)
  }

  return (
    <ListDetailPage
      pageInfo={pageInfo}
      title='Ventures'
      columns={columns}
      onChange={onChange}
      tableOpts={
        { onRowDoubleClick: handleRowDoubleClick }
      }
      listOpts={{
        listItemRenderer: entity => <VentureCard entity={entity} />,
        detailRenderer: entity => <VentureDetails entity={entity} onChange={() => alert('nrfpt')} />,
      }}
    />
  );
};


export default VenturesPage;
