/**
 * TicketsGrid.tsx
 * 
 * Example of integrating tickets with data-grid
 */
import { useContext, useEffect, useState } from 'react';

// material-ui
import {
    Chip,
    Stack,
    Typography
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
import { LoadingContext, RefreshContext } from '@digitalaidseattle/core';
import { OpenPosition, openPositionService } from './openPositionService';
import { Venture, ventureService } from './ventureService';

// ==============================|| Tickets Grid ||============================== //

const PAGE_SIZE = 10;

type PageInfo<T> = {
    totalRowCount: number
    rows: T[]
}

export default function StaffingTable() {
    const [ventures, setVentures] = useState<Venture[]>([]);
    const { setLoading } = useContext(LoadingContext);
    const { refresh } = useContext(RefreshContext);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const apiRef = useGridApiRef();

    useEffect(() => {
        setLoading(true);
        ventureService.getAll()
            .then(ventures => setVentures(ventures))
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        setLoading(true);
        openPositionService.findOpen(['Please fill', 'Proposed'])
            .then((staff: OpenPosition[]) => {
                staff.forEach(position => {
                    const venture = ventures.find(v => v.id === position.ventureId);
                    if (venture) {
                        position.venture = venture.partner.name
                        position.ventureStatus = venture.status
                    }
                });
                const venturePositions = staff.filter(s => ['Active', 'Under evaluation'].includes(s.ventureStatus!))
                setPageInfo({ rows: venturePositions, totalRowCount: venturePositions.length });
            })
            .finally(() => setLoading(false))
    }, [refresh, ventures]);


    const VENTURE_COLORS  = {
        'Active': 'primary',
        'Under evaluation': 'warning',
    } as any;

    const POSITION_COLORS  = {
        'Please fill': 'primary',
        'Proposed': 'success',
    } as any;

    const getColumns = (): GridColDef[] => {
        return [
            {
                field: 'venture',
                headerName: 'Venture',
                width: 250,
            }, {
                field: 'ventureStatus',
                headerName: 'Venture Status',
                width: 200,
                renderCell: (param: GridRenderCellParams) => {
                    return <Chip label={param.row.ventureStatus} color={VENTURE_COLORS[param.row.ventureStatus]} />
                }
            },
            {
                field: 'role',
                headerName: 'Roles',
                width: 250,
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 200,
                renderCell: (param: GridRenderCellParams) => {
                    console.log(param)
                    return <Chip label={param.row.status} color={POSITION_COLORS[param.row.status]} />
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
}
