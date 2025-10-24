/**
 *  ListDetailPage.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { BarsOutlined, IdcardOutlined, TableOutlined } from "@ant-design/icons";
import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { EntityGrid } from "./EntityGrid";
import { EntityTable } from "./EntityTable";
import { EntityList } from "./EntityList";

export type ListDetailPageProps<T extends Entity> = {
    pageInfo: PageInfo<T>;
    title: string;
    columns: GridColDef<T[][number]>[];
    toolbar?: () => any;
    onChange: (queryModel: any) => void;
    tableOpts?: {
        onRowDoubleClick: (evt: any) => void;
    }
    gridOpts?: {
        cardRenderer: (entity: T) => React.ReactNode;
    }
    listOpts?: {
        listItemRenderer: (entity: T) => React.ReactNode;
        detailRenderer: (entity: T) => React.ReactNode;
    }
}

export function ListDetailPage<T extends Entity>({
    pageInfo, title, columns, toolbar, onChange, tableOpts, gridOpts, listOpts
}: ListDetailPageProps<T>) {
    const [showType, setShowType] = useState<string>('table');
    return (
        <>
            <Stack direction={'row'} gap={1}>
                <Typography variant='h2'>{title}</Typography>
                <IconButton onClick={() => setShowType('table')}>
                    <TableOutlined />
                </IconButton>
                <IconButton onClick={() => setShowType('grid')}>
                    <IdcardOutlined />
                </IconButton>
                <IconButton onClick={() => setShowType('list')}>
                    <BarsOutlined />
                </IconButton>
            </Stack>
            <Divider />
            <Box sx={{ margin: 1 }}>
                {showType === 'grid' && gridOpts &&
                    <EntityGrid
                        pageInfo={pageInfo}
                        onChange={onChange}
                        cardRenderer={gridOpts.cardRenderer}
                    />}
                {showType === 'table' &&
                    <EntityTable
                        pageInfo={pageInfo}
                        onChange={onChange}
                        columns={columns}
                        toolbar={toolbar}
                        onRowDoubleClick={tableOpts ? tableOpts.onRowDoubleClick : () => { }}
                    />}
                {showType === 'list' && listOpts &&
                    <EntityList
                        pageInfo={pageInfo}
                        toolbar={toolbar}
                        listItemRenderer={listOpts.listItemRenderer}
                        detailRenderer={listOpts.detailRenderer}
                    />}
            </Box>
        </>
    );
};

export default ListDetailPage;