/**
 *  ListDetailPage.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { BarsOutlined, IdcardOutlined, TableOutlined } from "@ant-design/icons";
import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Card, CardContent, CardHeader, IconButton, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { EntityGrid } from "./EntityGrid";
import { EntityList } from "./EntityList";
import { EntityTable } from "./EntityTable";

export type ListDetailPageProps<T extends Entity> = {
    pageInfo: PageInfo<T>;
    title: string;
    toolbar?: () => any;
    onChange: (queryModel: any) => void;
    tableOpts?: {
        columns: GridColDef<T[][number]>[];
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
    pageInfo, title, toolbar, onChange, tableOpts, gridOpts, listOpts
}: ListDetailPageProps<T>) {
    const [showType, setShowType] = useState<string>('table');
    return (
        <Card >
            <CardHeader
                title={
                    <Stack direction={'row'} gap={1}>
                        <Typography variant='h2'>{title}</Typography>
                        {/* <IconButton onClick={() => setShowType('table')}>
                            <TableOutlined />
                        </IconButton>
                        <IconButton onClick={() => setShowType('grid')}>
                            <IdcardOutlined />
                        </IconButton>
                        <IconButton onClick={() => setShowType('list')}>
                            <BarsOutlined />
                        </IconButton> */}
                    </Stack>
                }></CardHeader>
            <CardContent sx={{ p: 0 }}>
                {showType === 'table' && tableOpts &&
                    <EntityTable
                        pageInfo={pageInfo}
                        onChange={onChange}
                        columns={tableOpts.columns}
                        toolbar={toolbar}
                        onRowDoubleClick={tableOpts.onRowDoubleClick}
                    />}
                {/* {showType === 'grid' && gridOpts &&
                    <EntityGrid
                        pageInfo={pageInfo}
                        onChange={onChange}
                        cardRenderer={gridOpts.cardRenderer}
                    />}
                {showType === 'list' && listOpts &&
                    <EntityList
                        pageInfo={pageInfo}
                        toolbar={toolbar}
                        listItemRenderer={listOpts.listItemRenderer}
                        detailRenderer={listOpts.detailRenderer}
                    />} */}
            </CardContent>
        </Card>
    );
};

export default ListDetailPage;