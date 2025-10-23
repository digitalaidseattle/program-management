
// material-ui
import { GridColDef } from '@mui/x-data-grid';
import ListDetailPage from '../../components/ListDetailPage';
import { Venture, ventureService } from '../../services/dasVentureService';
import { VentureCard } from './VentureCard';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const columns: GridColDef<Venture[][number]>[] = [
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
    // if (queryModel) {
    //   ventureService.find(queryModel)
    //   .then(pageInfo => {
    //     console.log(pageInfo)
    //     setPageInfo(pageInfo)
    //   })
    // }

    ventureService.getAll()
      .then(data => {
        console.log(data)
        setPageInfo({ rows: data, totalRowCount: data.length })
      })
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
      cardRenderer={entity => <VentureCard key={entity.id} entity={entity} />}
      onRowDoubleClick={handleRowDoubleClick}
    />
  );
};

export default VenturesPage;
