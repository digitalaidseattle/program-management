/**
 *  EpicPanel.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Chip, IconButton, Stack, Typography } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridPaginationModel,
    GridRenderCellParams,
    GridRowId,
    GridSortModel,
    useGridApiRef
} from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { dasTaskGroupService } from "../../api/dasTaskGroupService";
// assets
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { LoadingContext, RefreshContext } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import { VentureProps } from "../../api/dasProjectService";
import { dasTaskService, Task } from "../../api/dasTaskService";
import TaskDialog from "./taskDialog";

const PAGE_SIZE = 10;
const STATUS_COLOR_MAP: any = {
    'Delivered': 'success',
    'Paused': 'warning',
    'Todo': 'primary',
    "inbox": 'primary',
    "needs re-work": 'error',
    "Approved": 'success',
    "In progress": 'warning',
    "Someday maybe": 'primary',
    "Cancelled": 'error',
}

const StatusCell = (props: { status: string }) => {
    return (props.status !== undefined &&
        <Chip
            color={STATUS_COLOR_MAP[props.status]}
            label={props.status} />
    )
}

export const TasksPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);
    const [taskGroup, setTaskGroup] = useState<any>();

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const [selectedTask, setSelectedTask] = useState<Task>();
    const [showEditTask, setShowEditTask] = useState<boolean>(false);
    const { setRefresh } = useContext(RefreshContext);
    const apiRef = useGridApiRef();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            dasTaskGroupService.getById(venture.evaluatingTaskGroup)
                .then((tg: any) => {
                    setTaskGroup(tg)
                    setPageInfo({ rows: tg.tasks, totalRowCount: tg.tasks.length });
                })
                .finally(() => setLoading(false))
        }
    }, [venture]);

    const handleEditClick = (id: GridRowId) => () => {
        const found = pageInfo.rows.find(t => t.id === id);
        setSelectedTask(found);
        setShowEditTask(true);
    };

    const handleAddClick = () => {
        setSelectedTask(dasTaskService.emptyTask());
        setShowEditTask(true);
    };

    const getColumns = (): GridColDef[] => {
        return [
            {
                field: 'actions',
                type: 'actions',
                renderHeader: () => (
                    <IconButton size="small" color="primary" onClick={handleAddClick}>
                        <PlusCircleOutlined />
                    </IconButton>
                ),
                width: 100,
                cellClassName: 'actions',
                getActions: ({ id }) => {
                    return [
                        <GridActionsCellItem
                            icon={<EditOutlined />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(id)}
                            color="inherit"
                        />
                    ];
                },
            },
            {
                field: 'phase',
                headerName: 'Phase',
                width: 100,
            },
            {
                field: 'title',
                headerName: 'Title',
                width: 300,
            },
            {
                field: 'dueDate',
                headerName: 'Due Date',
                width: 150,
                renderCell: (params: GridRenderCellParams<any, string>) => (
                    <Typography>{params.row.dueDate && format(params.row.dueDate, "MMM dd, yyyy")}</Typography>
                )
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 150,
                renderCell: (params: GridRenderCellParams<any, string>) => (
                    <StatusCell status={params.row.status} />
                )
            },
            {
                field: 'driEmail',
                headerName: 'DRI',
                width: 300,
            }
        ];
    }

    function handleSuccess(): void {
        setRefresh(0);
        setShowEditTask(false)
    }

    function handleError(error: any): void {
        console.error(error)
        throw error;
    }

    return (taskGroup &&
        <>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Typography fontWeight={600}>Group Name: </Typography>
                        <Typography> {taskGroup.name}</Typography>
                    </Stack>
                </Stack>
                <DataGrid
                    apiRef={apiRef}
                    rows={pageInfo.rows}
                    columns={getColumns()}

                    paginationMode='client'
                    paginationModel={paginationModel}
                    rowCount={pageInfo.totalRowCount}
                    onPaginationModelChange={setPaginationModel}

                    sortingMode='client'
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}

                    pageSizeOptions={[5, 10, 25, 100]}
                    disableRowSelectionOnClick
                />
            </Stack>
            {selectedTask &&
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TaskDialog
                        entity={selectedTask}
                        open={showEditTask}
                        taskGroup={taskGroup}
                        handleSuccess={handleSuccess}
                        handleError={handleError} />
                </LocalizationProvider>
            }
        </>
    )
};
