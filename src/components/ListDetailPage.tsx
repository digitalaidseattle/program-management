/**
 *  ListDetailPage.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { IdcardOutlined, TableOutlined } from "@ant-design/icons";
import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { EntityGrid } from "./EntityGrid";
import { EntityTable } from "./EntityTable";

export type ListDetailPageProps<T extends Entity> = {
    pageInfo: PageInfo<T>;
    title: string;
    columns: GridColDef<T[][number]>[];
    toolbar?: () => any;
    onChange: (queryModel: any) => void;
    onRowDoubleClick: (evt: any) => void;
    cardRenderer: (entity: T) => React.ReactNode;
}

export function ListDetailPage<T extends Entity>({
    pageInfo, title, columns, toolbar, onChange, onRowDoubleClick, cardRenderer
}: ListDetailPageProps<T>) {
    const [showGrid, setShowGrid] = useState<boolean>(false);
    return (
        <>
            <Stack direction={'row'} gap={1}>
                <Typography variant='h2'>{title}</Typography>
                <IconButton onClick={() => setShowGrid(false)}>
                    <TableOutlined />
                </IconButton>
                <IconButton onClick={() => setShowGrid(true)}>
                    <IdcardOutlined />
                </IconButton>
            </Stack>
            <Divider />
            <Box sx={{ margin: 1 }}>
                {showGrid &&
                    <EntityGrid
                        pageInfo={pageInfo}
                        onChange={onChange}
                        cardRenderer={cardRenderer}
                    />}
                {!showGrid &&
                    <EntityTable
                        pageInfo={pageInfo}
                        onChange={onChange}
                        columns={columns}
                        toolbar={toolbar}
                        onRowDoubleClick={onRowDoubleClick}
                    />}
            </Box>
        </>
    );
};

export default ListDetailPage;