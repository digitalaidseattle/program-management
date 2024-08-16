
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Stack, Typography } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridPaginationModel,
    GridRowId,
    GridSortModel,
    useGridApiRef
} from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../components/contexts/LoadingContext";
import { dasTaskGroupService, Task } from "../../services/dasTaskGroupService";
import { VentureProps } from "../../services/dasVentureService";
import { PageInfo } from "../../services/supabaseClient";
// assets
import { EditOutlined } from '@ant-design/icons';
import TaskDialog from "./taskDialog";

const PAGE_SIZE = 10;

export const TasksPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);
    const [taskGroup, setTaskGroup] = useState<any>();

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const [selectedTask, setSelectedTask] = useState<Task>();
    const [showEditTask, setShowEditTask] = useState<boolean>(false);
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
        setSelectedTask(pageInfo.rows.find(t => t.id === id));
        setShowEditTask(true);
    };

    const getColumns = (): GridColDef[] => {
        return [
            {
                field: 'phase',
                headerName: 'Phase',
                width: 50,
            },
            {
                field: 'title',
                headerName: 'Title',
                width: 300,
            },

            {
                field: 'status',
                headerName: 'Status',
                width: 200,
            },
            {
                field: 'driEmail',
                headerName: 'DRI',
                width: 300,
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
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
            }
        ];
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
            <TaskDialog
                open={showEditTask}
                task={selectedTask}
                handleSuccess={function (): void {
                    setShowEditTask(false)
                }}
                handleError={function (): void {
                    throw new Error("Function not implemented.");
                }} />
        </>
    )
};