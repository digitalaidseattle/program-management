
/**
 *  MeetingsPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRenderCellParams, GridRowId, GridSortModel, useGridApiRef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../components/contexts/LoadingContext";
import { dasMeetingService } from "../../services/dasMeetingService";
import { dasTaskGroupService } from "../../services/dasTaskGroupService";
import { VentureProps } from "../../services/dasVentureService";
import { PageInfo } from "../../services/supabaseClient";



export const MeetingsPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const apiRef = useGridApiRef();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            dasTaskGroupService.getById(venture.evaluatingTaskGroup)
                .then((tg: any) => {
                    dasMeetingService.findAll(tg)
                        .then((meetings: any) => {
                            const sorted = meetings.sort((m1: any, m2: any) => m2.startDateTime.time > m1.startDateTime.time);
                            setPageInfo({ rows: sorted, totalRowCount: sorted.length });
                        })
                })
                .finally(() => setLoading(false))

        }
    }, [venture]);


    const handleEditClick = (id: GridRowId) => () => {
        console.log(id)
    };

    const handleAddClick = () => {
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
                field: 'date',
                headerName: 'Date',
                width: 150,
                renderCell: (params: GridRenderCellParams<any, string>) => (
                    <Typography>{format(params.row.startDateTime, "MMMM d yyy")}</Typography>
                )
            },
            {
                field: 'time',
                headerName: 'Time',
                width: 150,
                renderCell: (params: GridRenderCellParams<any, string>) => (
                    <Typography>{format(params.row.startDateTime, "hh:mm")}</Typography>
                )
            },
            {
                field: 'meetingPurpose',
                headerName: 'Purpose',
                width: 300,
            },

            {
                field: 'attendees',
                headerName: 'Attendees',
                width: 500,
                renderCell: (params: GridRenderCellParams<any, string>) => (
                    <Typography>{params.row.attendees.join(', ')}</Typography>
                )
            }
        ];
    }


    return (venture &&
        <>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Typography fontWeight={600}>Group Name: </Typography>
                        <Typography>{venture.title}</Typography>
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
        </>
    )
};
