/**
 *  VenturesTable.tsx
 *
 *  Display a table of ventures.
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { useState } from 'react';

// material-ui
import {
    Box,
    Chip,
    SortDirection,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { useNavigate } from 'react-router';

function descendingComparator(a: any, b: any, orderBy: string) {
    switch (orderBy) {
        case 'clientName':
            return b.clientName < a.clientName ? -1 : b.clientName > a.clientName ? 1 : 0;
        case 'phone':
            return b.phone < a.phone ? -1 : b.phone > a.phone ? 1 : 0;
        case 'email':
            return b.email < a.email ? -1 : b.email > a.email ? 1 : 0;
        case 'id':
        default:
            return b.id < a.id ? -1 : b.id > a.id ? 1 : 0;
    }
}

function getComparator(order: SortDirection, orderBy: string) {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

const STATUS_COLOR_MAP: any = {
    'Active': 'success',
    'Cancelled': 'warning',
    'Under evaluation': 'primary',
    "Declined": 'danger'
}

const StatusCell = (props: { status: string }) => {
    return <Chip
        color={STATUS_COLOR_MAP[props.status]}
        label={props.status} />
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'trackingNo',
        align: 'left',
        disablePadding: false,
        label: 'Name'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Partner'
    },
    {
        id: 'status',
        align: 'left',
        disablePadding: true,
        label: 'Status'
    },
    {
        id: 'carbs',
        align: 'left',
        disablePadding: false,
        label: 'Start Date'
    },
    {
        id: 'protein',
        align: 'left',
        disablePadding: false,
        label: 'Epics'
    },
    {
        id: 'contributors',
        align: 'left',
        disablePadding: false,
        label: 'Contributors'
    }
];

// ==============================|| Ventures TABLE - HEADER ||============================== //
type TableHeadProps = {
    order: SortDirection,
    orderBy: string
};
const VenturesTableHead: React.FC<TableHeadProps> = ({ order, orderBy }) => {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align as "left" | "right" | "center" | "justify" | "inherit" | undefined}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : 'desc'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| Ventures TABLE ||============================== //


export default function VenturesTable(ventures: any[]): any {
    const [order] = useState<SortDirection>('desc');
    const [orderBy] = useState<string>('id');

    const navigate = useNavigate();

    const handleClick = (venture: any) => {
        return () => navigate(`/venture/${venture.id}`)
    }

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <VenturesTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {ventures.sort(getComparator(order, orderBy))
                            .map((venture: any, index: number) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        id={venture.id}
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        tabIndex={-1}
                                        key={index}
                                        onClick={handleClick(venture)}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" align="left">{venture.name}</TableCell>
                                        <TableCell align="left">{venture.partner}</TableCell>
                                        <TableCell align="left">
                                            <StatusCell status={venture.status} />
                                        </TableCell>
                                        <TableCell align="left">
                                            {venture.startDate}
                                        </TableCell>
                                        <TableCell align="left">{venture.epicIds.length}</TableCell>
                                        <TableCell align="left">{venture.contributorIds.length}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
