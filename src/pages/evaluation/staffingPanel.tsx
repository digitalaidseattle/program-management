
/**
 *  StaffingPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRowId, GridSortModel, useGridApiRef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../components/contexts/LoadingContext";
import { dasStaffingService } from "../../services/dasStaffingService";
import { VentureProps } from "../../services/pmVentureService";
import { PageInfo } from "../../services/supabaseClient";

const PAGE_SIZE = 10;

export const StaffingPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const apiRef = useGridApiRef();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            // dasTaskGroupService.getById(venture.evaluatingTaskGroup)
            //     .then((tg: any) => setTaskGroup(tg))
            //     .finally(() => setLoading(false))

            dasStaffingService.findAll(venture)
                .then((staff: any) => {
                    console.log(staff)
                    setPageInfo({ rows: staff, totalRowCount: staff.length });
                })
                .finally(() => setLoading(false))

        }
    }, [venture]);

    // useEffect(() => {
    //     if (volunteers && taskGroup) {
    //         const resp = volunteers.filter(vol =>
    //             taskGroup.responsibleIds.includes(vol.id)
    //             || taskGroup.ventureProductManagerIds.includes(vol.id)
    //             || taskGroup.ventureProjectManagerIds.includes(vol.id)
    //             || taskGroup.contributorPdMIds.includes(vol.id));
    //         console.log('resp', volunteers, resp, taskGroup)
    //         setResponsible(resp)
    //     }
    // }, [volunteers, taskGroup])

    const handleEditClick = (_id: GridRowId) => () => {
        alert('Not ready ')
    };

    const handleAddClick = () => {
        alert('Not ready ')
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
                field: 'status',
                headerName: 'Status',
                width: 100,
            },
            {
                field: 'importance',
                headerName: 'Importance',
                width: 100,
            },
            {
                field: 'roles',
                headerName: 'Roles',
                width: 300,
            },
            {
                field: 'timing',
                headerName: 'Timing',
                width: 150,
            },
            {
                field: 'volunteerAssigned',
                headerName: 'Volunteer Assigned',
                width: 300,
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
