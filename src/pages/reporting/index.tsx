import { HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { LoadingContext, useNotifications } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { VentureReport, VentureReportService } from "../../services/dasVentureReportService";
import { HEALTH_STATUS_CHIPS } from "../../components/StatusChip";
import { EntityTable } from "../../components/EntityTable";
import VentureReportDialog from "../../components/VentureReportDialog";


const ReportingPage = () => {
  const ventureReportService = VentureReportService.instance();
  const notifications = useNotifications();
  const { setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const [pageInfo, setPageInfo] = useState<PageInfo<VentureReport>>({ rows: [], totalRowCount: 0 });
  const [queryModel, setQueryModel] = useState<QueryModel>();
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [queryModel]);


  function fetchData() {
    setLoading(true);
    if (queryModel) {
      ventureReportService.find(queryModel)
        .then(pageInfo => setPageInfo(pageInfo))
        .catch(err => {
          console.error('Failed to load reports', err);
          notifications.error('Unable to load reports right now.');
        })
        .finally(() => setLoading(false));
    }
  };


  const columns: GridColDef<VentureReport[][number]>[] = [
    {
      field: 'venture_id', headerName: 'Venture',
      renderCell: (params) => (
        <Tooltip title="click to view venture">
          <NavLink to={`/ventures/${params.row.venture_id}`} >{params.row.venture!.venture_code}</NavLink>
        </Tooltip>
      ),
      width: 300,
    },
    {
      field: 'reporting_date', headerName: 'Reporting Date',
      renderCell: (params) => (
        dayjs(params.row.reporting_date).format('MM/DD/YYYY')
      )
    },
    {
      field: 'status', headerName: 'Status', renderCell: (params) => {
        return HEALTH_STATUS_CHIPS[params.row.health]
      }
    },
    {
      field: 'successes', headerName: 'Successes',
      width: 200
    },
    {
      field: 'reported_by', headerName: 'Reported By',
      flex: 1,
    }
  ];

  function toolbar() {
    return (
      <Stack direction='row' alignItems={'center'}>
        <Toolbar>
          <IconButton color='primary' onClick={() => setShowAddDialog(true)}><PlusCircleOutlined /></IconButton>
        </Toolbar>
      </Stack>
    );
  }

  function changeSelectedReport(id: any): void {
    navigate(`/ventures/status-report/${id}`)
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <NavLink to={`/ventures`} >Ventures</NavLink>
        <Typography color="text.primary">Reports </Typography>
      </Breadcrumbs>
      <Card>
        <CardHeader
          title="Venture reports"
          subheader="Venture reports across the program." />
        <CardContent>
          <EntityTable
            pageInfo={pageInfo}
            onChange={setQueryModel}
            columns={columns}
            toolbar={toolbar}
            onRowDoubleClick={(evt) => changeSelectedReport(evt.id)}
          />
          <VentureReportDialog
            title={'Add Venture Report'}
            onClose={() => setShowAddDialog(false)}
            open={showAddDialog} />
        </CardContent>
      </Card >
    </>
  );
};

export default ReportingPage;
