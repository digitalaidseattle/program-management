/**
 *  reporting/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Toolbar
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { PlusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { LoadingContext, useNotifications } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';

import { EntityTable } from '../../components/EntityTable';
import { HEALTH_STATUS_CHIPS } from '../../components/StatusChip';
import { VentureReportDetails } from '../../components/VentureReportDetails';
import { VentureReport, VentureReportService } from '../../services/dasVentureReportService';
import VentureReportDialog from '../../components/VentureReportDialog';

const ReportingPage = () => {
  const ventureReportService = VentureReportService.instance();
  const notifications = useNotifications();
  const { setLoading } = useContext(LoadingContext);

  const [pageInfo, setPageInfo] = useState<PageInfo<VentureReport>>({ rows: [], totalRowCount: 0 });
  const [queryModel, setQueryModel] = useState<QueryModel>();
  const [selectedReport, setSelectedReport] = useState<VentureReport>();

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [queryModel]);

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

  const handleBackToTable = () => setSelectedReport(undefined);

  const columns: GridColDef<VentureReport[][number]>[] = [
    {
      field: 'venture_code', headerName: 'Venture',
      renderCell: (params) => (
        params.row.venture!.venture_code
      ),
      width: 300,
    },
    {
      field: 'reporting_date', headerName: 'Reporting Date',
      renderCell: (params) => (
        dayjs(params.row.reporting_date).format('MM/DD/YYYY')
      ),
      width: 150

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

  function toolbar() {
    return (
      <Stack direction='row' alignItems={'center'}>
        <Toolbar>
          <IconButton color='primary' onClick={() => setShowAddDialog(true)}><PlusCircleOutlined /></IconButton>
        </Toolbar>
      </Stack>
    );
  }
  return (
    <Card>
      <CardHeader
        title="Venture reports"
        subheader="Venture reports across the program." />
      <CardContent>
        {!selectedReport ? (
          <EntityTable
            pageInfo={pageInfo}
            onChange={setQueryModel}
            columns={columns}
            toolbar={toolbar}
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
        <VentureReportDialog
          title={'Add Venture Report'}
          onClose={() => setShowAddDialog(false)}
          open={showAddDialog} />
      </CardContent>
    </Card >
  );
};

export default ReportingPage;
