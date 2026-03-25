/**
 * StaffingTable.tsx
 * 
 * Example of integrating tickets with data-grid
 */
import { useState } from 'react';

// material-ui
import {
    Avatar,
    Box,
    Stack,
    Typography
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRenderCellParams,
    GridSortModel
} from '@mui/x-data-grid';

// third-party

// project import
import { profileService } from '../services/dasProfileService';
import { Staffing } from '../services/dasStaffingService';
import { STAFFING_STATUS_CHIPS, StatusChip } from './StatusChip';

// ==============================|| Tickets Grid ||============================== //

const PAGE_SIZE = 25;
export type StaffingColumnKey = 'role' | 'status' | 'volunteer' | 'level' | 'skills' | 'venture' | 'team';

const DEFAULT_COLUMN_KEYS: StaffingColumnKey[] = ['role', 'status', 'volunteer', 'level', 'skills'];

// Need to update list if db schema ever changes
const STAFFING_COLUMNS: Record<StaffingColumnKey, GridColDef<Staffing>> = {
    role: {
        field: 'role.name',
        headerName: 'Roles',
        flex: 1,
        minWidth: 220,
        renderCell: (params: GridRenderCellParams<Staffing>) => params.row.role?.name ?? 'N/A',
    },
    status: {
        field: 'status',
        headerName: 'Status',
        width: 170,
        renderCell: (params: GridRenderCellParams<Staffing>) =>
            params.row.status
                ? STAFFING_STATUS_CHIPS[params.row.status] ?? <StatusChip label={params.row.status} color="gray" />
                : <StatusChip label="N/A" color="red" />,
    },
    volunteer: {
        field: 'volunteer.name',
        headerName: 'Volunteer',
        flex: 1,
        minWidth: 260,
        renderCell: (params: GridRenderCellParams<Staffing>) => (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                <Avatar
                    variant="rounded"
                    src={params.row.volunteer ? profileService.getPicUrl(params.row.volunteer.profile!) : undefined}
                    sx={{ width: 30, height: 30, objectFit: 'contain' }}
                />
                <Typography>{params.row.volunteer ? params.row.volunteer.profile!.name : 'Unassigned'}</Typography>
            </Stack>
        ),
    },
    level: {
        field: 'level',
        headerName: 'Level requirement',
        width: 200,
    },
    skills: {
        field: 'skills',
        headerName: 'Desired skills',
        width: 300,
    },
    venture: {
        field: 'venture.title',
        headerName: 'Venture',
        width: 250,
        renderCell: (params: GridRenderCellParams<Staffing>) => params.row.venture?.venture_code ?? '',
        valueGetter: (_value, row) => row.venture?.venture_code ?? undefined,
    },
    team: {
        field: 'team.name',
        headerName: 'Team',
        width: 250,
        renderCell: (params: GridRenderCellParams<Staffing>) => params.row.team?.name ?? '',
        valueGetter: (_value, row) => row.team?.name ?? undefined,
    }
};

export type StaffingTableProps = {
    title: string;
    items: Staffing[];
    columnKeys?: StaffingColumnKey[];
    autoPageSize?: boolean;
}

export const StaffingTable: React.FC<StaffingTableProps> = ({ items, columnKeys = DEFAULT_COLUMN_KEYS, autoPageSize = false }) => {

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'status', sort: 'desc' }]);
    const columns = columnKeys.map((key) => STAFFING_COLUMNS[key]);

    return (
        <Box sx={{ height: '100%', minHeight: 0 }}>
            <DataGrid
                rows={items}
                columns={columns}
                paginationMode='client'
                paginationModel={autoPageSize ? undefined : paginationModel}
                onPaginationModelChange={autoPageSize ? undefined : setPaginationModel}
                sortingMode='client'
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                pageSizeOptions={[5, 10, 25, 100]}
                disableRowSelectionOnClick
                autoPageSize={autoPageSize}
                sx={{
                    height: '100%',
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-cellContent': {
                        lineHeight: 'normal',
                    },
                }}
            />
        </Box>
    )
}
