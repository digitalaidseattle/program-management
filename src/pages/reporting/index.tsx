<<<<<<< HEAD
/**
 *  reporting/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { HomeOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
<<<<<<< HEAD
=======
import { LoadingContext, useNotifications } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Toolbar
>>>>>>> a1aca81 (reuse venture report details)
=======
>>>>>>> 5b8aad2 (reporting cleanup)
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5b8aad2 (reporting cleanup)
import { NavLink, useNavigate } from 'react-router-dom';

import { LoadingContext, useNotifications } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';

import { EntityTable } from '../../components/EntityTable';
import { HEALTH_STATUS_CHIPS } from '../../components/StatusChip';
import VentureReportDialog from '../../components/VentureReportDialog';
import { VentureReport, VentureReportService } from '../../services/dasVentureReportService';
<<<<<<< HEAD
=======
import { Link as RouterLink } from 'react-router-dom';
import { EntityTable } from '../../components/EntityTable';
import { HEALTH_STATUS_CHIPS } from '../../components/StatusChip';
import { VentureReport, VentureReportService } from '../../services/dasVentureReportService';
import { VentureReportDetails } from '../../components/VentureReportDetails';
>>>>>>> a1aca81 (reuse venture report details)
=======
>>>>>>> 5b8aad2 (reporting cleanup)

const ReportingPage = () => {
  const ventureReportService = VentureReportService.instance();
  const notifications = useNotifications();
  const { setLoading } = useContext(LoadingContext);
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();

  const [pageInfo, setPageInfo] = useState<PageInfo<VentureReport>>({ rows: [], totalRowCount: 0 });
  const [queryModel, setQueryModel] = useState<QueryModel>();

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
=======

  const [pageInfo, setPageInfo] = useState<PageInfo<VentureReport>>({ rows: [], totalRowCount: 0 });
  const [queryModel, setQueryModel] = useState<QueryModel>();
  const [selectedReport, setSelectedReport] = useState<VentureReport>();
>>>>>>> a1aca81 (reuse venture report details)
=======
  const navigate = useNavigate();

  const [pageInfo, setPageInfo] = useState<PageInfo<VentureReport>>({ rows: [], totalRowCount: 0 });
  const [queryModel, setQueryModel] = useState<QueryModel>();

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
>>>>>>> 5b8aad2 (reporting cleanup)

  useEffect(() => {
    fetchData();
  }, [queryModel]);

<<<<<<< HEAD
=======
  useEffect(() => {
    fetchData();
  }, [queryModel]);

>>>>>>> a1aca81 (reuse venture report details)
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

<<<<<<< HEAD
<<<<<<< HEAD

  const columns: GridColDef<VentureReport[][number]>[] = [
    {
      field: 'venture_id', headerName: 'Venture',
      renderCell: (params) => (
        <Tooltip title="click to view venture">
          <NavLink to={`/ventures/${params.row.venture_id}`} >{params.row.venture!.venture_code}</NavLink>
        </Tooltip>
=======
  const handleBackToTable = () => setSelectedReport(undefined);
=======
>>>>>>> 5b8aad2 (reporting cleanup)

  const columns: GridColDef<VentureReport[][number]>[] = [
    {
      field: 'venture_id', headerName: 'Venture',
      renderCell: (params) => (
<<<<<<< HEAD
        params.row.venture!.venture_code
>>>>>>> a1aca81 (reuse venture report details)
=======
        <Tooltip title="click to view venture">
          <NavLink to={`/ventures/${params.row.venture_id}`} >{params.row.venture!.venture_code}</NavLink>
        </Tooltip>
>>>>>>> 5b8aad2 (reporting cleanup)
      ),
      width: 300,
    },
    {
      field: 'reporting_date', headerName: 'Reporting Date',
      renderCell: (params) => (
        dayjs(params.row.reporting_date).format('MM/DD/YYYY')
<<<<<<< HEAD
      ),
      width: 150

=======
      )
>>>>>>> a1aca81 (reuse venture report details)
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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
      width: 200,
    },
    {
      field: 'id', headerName: 'Actions', renderCell: (params) => (
        <Button
          component={RouterLink}
          to={`/ventures/${params.row.venture_id}`}
          size="small"
          variant="outlined"
          onClick={e => e.stopPropagation()}
        >
          View Venture
        </Button>
      ),
      width: 200,
    },
  ];

  function changeSelectedReport(reportId: string) {
    ventureReportService.getById(reportId)
      .then(report => setSelectedReport(report!));
  }

  return (
    <Card>
      <CardHeader
        title="Venture reports"
        subheader="Venture reports across the program." />
      <CardContent>
        {!selectedReport ? (
>>>>>>> a1aca81 (reuse venture report details)
=======
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
>>>>>>> 5b8aad2 (reporting cleanup)
          <EntityTable
            pageInfo={pageInfo}
            onChange={setQueryModel}
            columns={columns}
<<<<<<< HEAD
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
<<<<<<< HEAD
=======
            onRowDoubleClick={(evt) => changeSelectedReport(evt.id)}
          />
        ) : (
          <Stack spacing={3}>
            <Toolbar>
              <Button size="small" onClick={handleBackToTable}>
                Back to table
              </Button>
            </Toolbar>
            {selectedReport && (
              <Card>
                <CardContent>
                  <VentureReportDetails report={selectedReport} />
                </CardContent>
              </Card>
            )}
          </Stack>
        )}
      </CardContent>
    </Card >
>>>>>>> a1aca81 (reuse venture report details)
=======
>>>>>>> 5b8aad2 (reporting cleanup)
  );
};

export default ReportingPage;
