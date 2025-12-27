import { LoadingContext, useNotifications } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Toolbar
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { EntityTable } from '../../components/EntityTable';
import { HEALTH_STATUS_CHIPS } from '../../components/StatusChip';
import { VentureReport, VentureReportService } from '../../services/dasVentureReportService';
import { VentureReportDetails } from '../../components/VentureReportDetails';

const ReportingPage = () => {
  const ventureReportService = VentureReportService.instance();
  const notifications = useNotifications();
  const { setLoading } = useContext(LoadingContext);

  const [pageInfo, setPageInfo] = useState<PageInfo<VentureReport>>({ rows: [], totalRowCount: 0 });
  const [queryModel, setQueryModel] = useState<QueryModel>();
  const [selectedReport, setSelectedReport] = useState<VentureReport>();

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
          <EntityTable
            pageInfo={pageInfo}
            onChange={setQueryModel}
            columns={columns}
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
  );
};

export default ReportingPage;
