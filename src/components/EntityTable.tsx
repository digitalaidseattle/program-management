/**
 *  EntityTable.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity } from "@digitalaidseattle/core";
import { PageInfo, QueryModel } from "@digitalaidseattle/supabase";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridFilterModel, GridRowSelectionModel, GridSortModel, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export type EntityTableProps<T extends Entity> = {
    columns: GridColDef<T[][number]>[];
    pageInfo: PageInfo<T>;
    toolbar?: () => any;
    onChange: (queryModel: any) => void;
    onRowDoubleClick: (evt: any) => void;
    onSelect?: (selectionModel: GridRowSelectionModel) => void;
}

export function EntityTable<T extends Entity>({
    pageInfo,
    columns,
    toolbar,
    onChange,
    onRowDoubleClick,
    onSelect
}: EntityTableProps<T>) {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
    const [sortModel, setSortModel] = useState<GridSortModel>([])
    const [filterModel, setFilterModel] = useState<GridFilterModel>();
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>();
    const [rowCountState, setRowCountState] = useState(pageInfo?.totalRowCount || 0,);
    const apiRef = useGridApiRef();

    useEffect(() => {
        if (pageInfo) {
            setRowCountState((prevRowCountState: number) =>
                pageInfo.totalRowCount !== undefined
                    ? pageInfo.totalRowCount
                    : prevRowCountState,
            );
        }
    }, [pageInfo, setRowCountState]);

    useEffect(() => {
        if (paginationModel && sortModel) {
            const queryModel = {
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                sortField: sortModel.length === 0 ? 'id' : sortModel[0].field,
                sortDirection: sortModel.length === 0 ? 'asc' : sortModel[0].sort,
                filterModel: filterModel ?? {}
            } as QueryModel;
            onChange(queryModel);
        }
    }, [paginationModel, sortModel, filterModel])

    useEffect(() => {
        onSelect && onSelect(selectionModel!);
    }, [selectionModel])

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                apiRef={apiRef}
                rows={pageInfo.rows}
                columns={columns}

                paginationMode='server'
                paginationModel={paginationModel}
                rowCount={rowCountState}
                onPaginationModelChange={setPaginationModel}

                sortingMode='server'
                sortModel={sortModel}
                onSortModelChange={setSortModel}

                filterMode='server'
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}

                pageSizeOptions={[5, 10, 25, 100]}
                onRowDoubleClick={onRowDoubleClick}

                disableRowSelectionOnClick
                slots={{ toolbar: toolbar }}
                showToolbar={toolbar !== undefined}

                checkboxSelection={onSelect !== undefined}
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={setSelectionModel}
            />
        </Box>
    )
}