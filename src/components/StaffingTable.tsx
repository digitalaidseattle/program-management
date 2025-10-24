/**
 * StaffingTable.tsx
 * 
 * Example of integrating tickets with data-grid
 */
import { useEffect, useState } from 'react';

// material-ui
import {
    Chip,
    Stack
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRenderCellParams,
    GridSortModel,
    useGridApiRef
} from '@mui/x-data-grid';

// third-party

// project import
import { PageInfo } from '@digitalaidseattle/supabase';
import { Staffing } from '../services/dasStaffingService';

// ==============================|| Tickets Grid ||============================== //

const PAGE_SIZE = 25;
export type StaffingTableProps = {
    title: string;
    items: Staffing[];
}

export const StaffingTable: React.FC<StaffingTableProps> = ({ items }) => {

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'status', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: items, totalRowCount: items.length });
    const apiRef = useGridApiRef();


    const POSITION_COLORS = {
        'Please fill': 'primary',
        'Proposed': 'success',
    } as any;

    useEffect(() => {
        setPageInfo({ rows: items, totalRowCount: items.length })
    }, [items])

    const getColumns = (): GridColDef[] => {
        return [
            {
                field: 'role.name',
                headerName: 'Roles',
                width: 250,
                renderCell: (param: GridRenderCellParams) => {
                    return param.row.role ? param.row.role.name : 'N/A'
                }
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 150,
                renderCell: (param: GridRenderCellParams) => {
                    return <Chip label={param.row.status} color={POSITION_COLORS[param.row.status]} />
                }
            },
            {
                field: 'volunteer.name',
                headerName: 'Volunteer',
                width: 150,
                renderCell: (param: GridRenderCellParams) => {
                    return param.row.volunteer ? param.row.volunteer.profile.name : ''
                }
            },
            {
                field: 'level',
                headerName: 'Level requirement',
                width: 200,
            },
            {
                field: 'skill',
                headerName: 'Desired skills',
                width: 300,
            }
        ];
    }

    return (
        <>
            <Stack spacing={2}>
                <DataGrid
                    apiRef={apiRef}
                    rows={pageInfo.rows}
                    columns={getColumns()}

                    paginationMode='client'
                    paginationModel={paginationModel}
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
}
