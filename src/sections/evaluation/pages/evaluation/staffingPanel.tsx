
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
import { dasStaffingService } from "../../api/dasStaffingService";
import StaffingDialog from "./staffingDialog";
import { VentureProps } from "../../api/dasProjectService";
import { LoadingContext, RefreshContext } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";

const PAGE_SIZE = 10;

export const StaffingPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

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
    }, [venture, refresh]);

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
            }
        ];
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
                    handleSuccess={function (): void {
                        setRefresh(0)
                        setShowEditStaff(false)
                    }}
                    handleError={function (): void {
                        throw new Error("Function not implemented.");
                    }} />
            }
        </>
    )
};
