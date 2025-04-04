/**
 *  MeetingsPanel.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRenderCellParams, GridRowId, GridSortModel, useGridApiRef } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LoadingContext, RefreshContext } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";

import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { TeamContext } from "../../api/dasTeamsService";
import { dasTaskGroupService, TaskGroup } from "../../api/dasTaskGroupService";
import { dasMeetingService, Meeting } from "../../api/dasMeetingService";
import MeetingDialog from "./meetingDialog";
import { VentureProps } from "../../api/dasProjectService";

export const MeetingsPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const [taskGroup, setTaskGroup] = useState<TaskGroup>();
    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
    const { team } = useContext(TeamContext);
    const apiRef = useGridApiRef();
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting>();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            dasTaskGroupService.getById(venture.evaluatingTaskGroup)
                .then((tg: any) => {
                    setTaskGroup(tg)
                    dasMeetingService.findAll(tg)
                        .then((meetings: any) => {
                            const sorted = meetings.sort((m1: any, m2: any) => m2.startDateTime.time > m1.startDateTime.time);
                            setPageInfo({ rows: sorted, totalRowCount: sorted.length });
                        })
                })
                .finally(() => setLoading(false))
        }
    }, [venture, refresh]);

    useEffect(() => {
        if (taskGroup) {
            dasMeetingService.findAll(taskGroup)
                .then((meetings: any) => {
                    const sorted = meetings.sort((m1: any, m2: any) => m2.startDateTime.time > m1.startDateTime.time);
                    setPageInfo({ rows: sorted, totalRowCount: sorted.length });
                })
        }
    }, [taskGroup]);


    const handleEditClick = (_id: GridRowId) => async () => {
        alert('Not implemented yet.')
        // const selected: Meeting = pageInfo.rows.find(m => m.id === _id)
        // Promise.all(selected.attendanceIds
        //     .map(async attId => dasAttendanceService.getById(attId)))
        //     .then(attendances => {
        //         selected.attendances = attendances;
        //         setSelectedMeeting(selected)
        //         setShowCreateDialog(true)
        //     })
    };

    const handleAddClick = () => {
        if (taskGroup && team) {
            if (taskGroup.ventureProjectManagerIds.length === 0) {
                alert('Task group requires a venture project manager to create a meeting.')
                return;
            } else {
                const newMeeting = dasMeetingService.newMeeting();
                newMeeting.taskGroupIds = [taskGroup.id!];
                newMeeting.teamIds = [team.id!];
                newMeeting.attendances = dasMeetingService.createAttendances(taskGroup);
                setSelectedMeeting(newMeeting)
                setShowCreateDialog(true)
            }
        }
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
                    <Typography>{format(params.row.startDateTime, "MMM d yyy")}</Typography>
                )
            },
            {
                field: 'time',
                headerName: 'Time',
                width: 150,
                renderCell: (params: GridRenderCellParams<any, string>) => (
                    <Typography>{format(params.row.startDateTime, "hh:mm a")}</Typography>
                )
            },
            {
                field: 'purpose',
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

    function handleSuccess(): void {
        setRefresh(0);
        setShowCreateDialog(false)
    }

    function handleError(error: any): void {
        console.error(error)
        throw error;
    }

    return (venture &&
        <>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Typography fontWeight={600}>Group Name: </Typography>
                        <Typography>{venture.ventureCode}</Typography>
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
            {selectedMeeting &&
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MeetingDialog
                        entity={selectedMeeting}
                        open={showCreateDialog} 
                        handleSuccess={handleSuccess}
                        handleError={handleError}  />
                </LocalizationProvider>
            }
        </>
    )
};
