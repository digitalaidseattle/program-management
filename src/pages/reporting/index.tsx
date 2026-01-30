import { ArrowsAltOutlined, DeleteOutlined, EditOutlined, HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { LoadingContext, useNotifications } from '@digitalaidseattle/core';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { EntityTable } from "../../components/EntityTable";
import { HEALTH_STATUS_CHIPS } from "../../components/StatusChip";
import VentureReportDialog from "../../components/VentureReportDialog";
import { VentureReport, VentureReportService } from "../../services/dasVentureReportService";


const ReportingPage = () => {
  const ventureReportService = VentureReportService.instance();
  const notifications = useNotifications();
  const { setLoading } = useContext(LoadingContext);

  const [pageInfo, setPageInfo] = useState<PageInfo<VentureReport>>({ rows: [], totalRowCount: 0 });
  const [queryModel, setQueryModel] = useState<QueryModel>();
  const [title, setTitle] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<VentureReport>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const columns: GridColDef<VentureReport>[] = [
    {
      field: 'venture_id',
      headerName: 'Venture',
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

  function changeSelectedReport(id: any): void {
    ventureReportService.getById(id)
      .then(found => {
        setTitle('Edit report');
        setSelectedReport(found!);
        setShowDialog(true);
      })
  }

  function toolbar() {
    function handleNewReport(): void {
      setTitle('Add report');
      setSelectedReport(ventureReportService.empty());
      setShowDialog(true);
    }

    function handleEdit(): void {
      changeSelectedReport(selectedIds[0]);
    }

    function handleDelete(): void {
      const confirmed = window.confirm(
        "Are you sure you want to delete the reports? This action cannot be undone."
      );

      if (!confirmed) {
        return;
      }
      setLoading(true);
      Promise
        .all(selectedIds.map(id => ventureReportService.delete(id)))
        .then(() => {
          fetchData();
          notifications.success("Reports deleted!")
        })
        .catch(error => {
          console.error("Error deleting report:", error);
          notifications.error(`Failed to delete report: ${error instanceof Error ? error.message : "Unknown error"}`);
        })
        .finally(() => setLoading(false));
    }

    return (
      <Stack direction='row' alignItems={'center'}>
        <Toolbar>
          <IconButton color='primary' onClick={handleNewReport}><PlusCircleOutlined /></IconButton>
          <IconButton color='primary' disabled={selectedIds.length !== 1} onClick={handleEdit}><EditOutlined /></IconButton>
          <IconButton color='primary' disabled={selectedIds.length === 0} onClick={handleDelete}><DeleteOutlined /></IconButton>
        </Toolbar>
      </Stack>
    );
  }

  function handleClose(evt: { report: VentureReport | null | undefined; }): void {
    if (evt.report) {
      if (evt.report.id) {
        ventureReportService.update(evt.report.id, evt.report)
          .then(() => {
            notifications.success('Thank you, the report has been updated.')
          })
      } else {
        ventureReportService.insert(evt.report)
          .then(() => {
            notifications.success('Thank you, the report has been added.')
          })
      }
    }
    setShowDialog(false)
  }

  function handleSelection(selectionModel: GridRowSelectionModel): void {
    if (selectionModel) {
      setSelectedIds(Array.from(selectionModel.ids) as string[])
    }
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
            onSelect={handleSelection}
          />
          <VentureReportDialog
            title={title}
            report={selectedReport!}
            onClose={handleClose}
            open={showDialog} />
        </CardContent>
      </Card >
    </>
  );
};

export default ReportingPage;
