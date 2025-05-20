/**
 *  StaffingPanel.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { LoadingContext } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRowId, GridSortModel, useGridApiRef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { VentureProps } from "../../api/dasProjectService";
import { dasStaffingService, StaffingNeed } from "../../api/dasStaffingService";
import StaffingDialog from "./staffingDialog";

const PAGE_SIZE = 10;

export const StaffingPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const apiRef = useGridApiRef();
    const [showEditStaff, setShowEditStaff] = useState<boolean>(false);
    const [selectedStaff, setSelectedStaff] = useState<any>();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            dasStaffingService.findAll(venture)
                .then((staff: any) => {
                    setPageInfo({ rows: staff, totalRowCount: staff.length });
                })
                .finally(() => setLoading(false))

        }
    }, [venture]);

    useEffect(() => {
        if (venture) {
            setLoading(true);
            dasStaffingService.findAll(venture)
                .then((staff: any) => {
                    setPageInfo({ rows: staff, totalRowCount: staff.length });
                })
                .finally(() => setLoading(false))

        }
    }, [selectedStaff]);

    const handleEditClick = (_id: GridRowId) => () => {
        const staff = pageInfo.rows.find(r => r.id === _id)
        setSelectedStaff(staff)
        setShowEditStaff(true)
    };

    const handleAddClick = () => {
        setSelectedStaff(dasStaffingService.newStaffingNeed())
        setShowEditStaff(true)
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
                width: 250,
                valueGetter: (params) => `${params.row.roles.join(", ")}`,
            },
            {
                field: 'levelRequirement',
                headerName: 'Level requirement',
                width: 200,
            },
            {
                field: 'desiredSkills',
                headerName: 'Desired skills',
                width: 300,
            },
            {
                field: 'timing',
                headerName: 'Timing',
                width: 150,
            },
            {
                field: 'contributors',
                headerName: 'Volunteer Assigned',
                width: 300,
                valueGetter: (params) => `${params.row.contributors ? params.row.contributors.join(", ") : ''}`,
            }
        ];
    }

    function handleSuccess(resp: StaffingNeed | null): void {
        console.log(resp)
        setShowEditStaff(false)
    }
    function handleError(error: any): void {
        console.error(error);
        setShowEditStaff(false)
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
            {selectedStaff &&
                <StaffingDialog
                    entity={selectedStaff!}
                    open={showEditStaff}
                    handleSuccess={handleSuccess}
                    handleError={handleError} />
            }
        </>
    )
};
