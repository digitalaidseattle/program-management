/**
 *  AllPositions.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import {
    Box,
    Chip,
    Divider
} from "@mui/material";
import { useEffect, useState } from "react";

import { InputFormDialog, InputOption } from "@digitalaidseattle/mui";
import { ColumnsPanelTrigger, DataGrid, FilterPanelTrigger, GridAddIcon, GridColDef, GridDeleteIcon, GridFilterListIcon, GridFilterModel, GridPaginationModel, GridRenderCellParams, GridRowParams, GridRowSelectionModel, GridSortModel, GridViewColumnIcon, Toolbar, ToolbarButton } from "@mui/x-data-grid";
import useRoles from "../../hooks/useRoles";
import useVolunteers from "../../hooks/useVolunteers";
import { Staffing, staffingService } from "../../services/dasStaffingService";
import { STAFFING_COMP } from "../ventures/Utils";
import { useNotifications } from "@digitalaidseattle/core";

const PAGE_SIZE = 10;

const AllPositions = () => {
    const notifications = useNotifications();

    const [staffing, setStaffing] = useState<Staffing[]>();
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [rowSelectionModel] = useState<GridRowSelectionModel>();
    const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'status', sort: 'desc' }])

    const [showStaffingDialog, setShowStaffingDialog] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<'new' | 'update'>('new');
    const [selectedStaffing, setSelectedStaffing] = useState<Staffing>();
    const { data: roles } = useRoles();
    const { data: volunteers } = useVolunteers();

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        staffingService.getAll()
            .then(s => setStaffing(s));
    }

    const getColumns = (): GridColDef[] => {
        return [
            {
                field: 'role.name',
                headerName: 'Roles',
                width: 250,
                renderCell: (param: GridRenderCellParams) => {
                    return param.row.role ? param.row.role.name : ''
                },
                valueGetter: (_value, row) => {
                    return row.role ? row.role.name : undefined
                },
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 150,
                renderCell: (param: GridRenderCellParams) => {
                    return (param.row.status ? STAFFING_COMP[param.row.status] : <Chip label={'N/A'} color={'error'} />)
                }
            },
            {
                field: 'volunteer.name',
                headerName: 'Volunteer',
                width: 200,
                renderCell: (param: GridRenderCellParams) => {
                    return param.row.volunteer ? param.row.volunteer.profile.name : ''
                },
                valueGetter: (_value, row) => {
                    return (row.volunteer && row.volunteer.profile.name) ? row.volunteer.profile.name : undefined
                },
            },
            {
                field: 'venture.title',
                headerName: 'Venture',
                width: 250,
                renderCell: (param: GridRenderCellParams) => {
                    return param.row.venture ? param.row.venture.venture_code : ''
                },
                valueGetter: (_value, row) => {
                    return (row.venture && row.venture.venture_code) ? row.venture.venture_code : undefined
                },
            },
            {
                field: 'team.name',
                headerName: 'Team',
                width: 250,
                renderCell: (param: GridRenderCellParams) => {
                    return param.row.team ? param.row.team.name : ''
                },
                valueGetter: (_value, row) => {
                    return (row.team && row.team.name) ? row.team.name : undefined
                }
            },
            {
                field: 'level',
                headerName: 'Level requirement',
                width: 150,
            
            },
            {
                field: 'skill',
                headerName: 'Desired skills',
                width: 300,
            }
        ];
    }

    function CustomToolbar() {
        return (
            <Toolbar>
                {/* Add your custom actions */}
                <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                    <ToolbarButton
                        title='New'
                        color="primary"
                        size="small"
                        onClick={() => alert('not ready')}>
                        <GridAddIcon /> New
                    </ToolbarButton>
                    <ToolbarButton
                        color="primary"
                        size="small"
                        disabled={!(rowSelectionModel && rowSelectionModel.ids.size > 0)}
                        onClick={() => alert('not ready')}>
                        <GridDeleteIcon /> Delete
                    </ToolbarButton>
                    <Divider />
                </Box>
                {/* Keep the some of thedefault toolbar items */}
                <Box>
                    <ColumnsPanelTrigger render={<ToolbarButton />}>
                        <GridViewColumnIcon fontSize="small" />
                    </ColumnsPanelTrigger>
                    <FilterPanelTrigger render={<ToolbarButton />}>
                        <GridFilterListIcon fontSize="small" />
                    </FilterPanelTrigger>
                </Box>
            </Toolbar>
        );
    }

    const staffingInputFields: InputOption[] = [
        {
            name: "status",
            label: 'Status',
            type: 'select',
            disabled: false,
            options: staffingService.STATUSES.map(e => ({ value: e, label: e }))
        },
        {
            name: "importance",
            label: 'Importance',
            type: 'select',
            disabled: false,
            options: staffingService.IMPORTANCES.map(e => ({ value: e, label: e }))
        },
        {
            name: "role_id",
            label: 'Role',
            type: 'select',
            disabled: false,
            options: roles.map(e => ({ value: e.id, label: e.name }))
        },
        {
            name: "levelRequirement",
            label: 'Level Requirement',
            type: 'select',
            disabled: false,
            options: staffingService.EXPERIENCE_LEVELS.map(e => ({ value: e, label: e }))
        },
        {
            name: "desiredSkills",
            label: 'Desired Skills',
            disabled: false
        },
        {
            name: "volunteer_id",
            label: 'Volunteer Assigned',
            type: 'select',
            disabled: false,
            options: [{ value: '', label: 'N/A' }, ...volunteers.map(e => ({ value: e.id, label: e.profile.name }))]
        }
    ]


    function handleRowDoubleClick(param: GridRowParams<any>): void {
        setEditMode('update');
        setSelectedStaffing(param.row);
        setShowStaffingDialog(true);
    }

    function handleStaffingChange(staffing: Staffing | null | undefined): void {
        if (staffing == undefined) {
            setShowStaffingDialog(false);
        } else {

            const cleaned = { ...staffing };
            delete cleaned.role;
            delete cleaned.team;
            delete cleaned.venture;
            delete cleaned.volunteer;
            staffingService.update(staffing.id, cleaned)
                .then(updated => {
                    fetchData();
                    notifications.success(`Updated staffing request${updated.volunteer ? (' for' + updated.volunteer.profile!.name) : ''}.`)
                })
                .finally(() => setShowStaffingDialog(false));
        }
    }

    return (
        <>
            <DataGrid
                rows={staffing}
                columns={getColumns()}

                showToolbar={true}
                slots={{ toolbar: CustomToolbar }}

                paginationMode='client'
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}

                sortingMode='client'
                sortModel={sortModel}
                onSortModelChange={setSortModel}

                filterModel={filterModel}
                onFilterModelChange={setFilterModel}

                pageSizeOptions={[5, 10, 25, 100]}
                disableRowSelectionOnClick

                onRowDoubleClick={(param) => handleRowDoubleClick(param)}
            />
            <InputFormDialog
                open={showStaffingDialog}
                title={editMode === 'new' ? 'Add Staffing Request' : 'Update Staffing Request'}
                entity={selectedStaffing}
                inputFields={staffingInputFields}
                onChange={handleStaffingChange} />
        </>
    );
};

export default AllPositions;