/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { ScrollList } from "./ScrollList";

type EntityListProps<T extends Entity> = {
    pageInfo: PageInfo<T>;
    toolbar?: () => any;
    listItemRenderer: (entity: T) => React.ReactNode;
    detailRenderer: (entity: T) => React.ReactNode;
}

export function EntityList<T extends Entity>({
    pageInfo, listItemRenderer, detailRenderer
}: EntityListProps<T>) {

    const [selectedItem, setSelectedItem] = useState<T>();

    useEffect(() => {
        if (pageInfo) {
            if (pageInfo.rows.length > 0) {
                setSelectedItem(pageInfo.rows[0])
            }
        }
    }, [pageInfo])

    return (
        <Stack direction="row" sx={{ height: "100vh" }}>
            <ScrollList
                items={pageInfo.rows}
                listItemRenderer={listItemRenderer}
                selectedItem={selectedItem}
                onSelect={setSelectedItem}
            />
            <Box
                sx={{
                    width: '100%',
                    height: "100%",             // fill parent container height
                    overflowY: "auto",          // enable vertical scroll
                    overflowX: "hidden",        // hide horizontal scroll (optional)
                    boxSizing: "border-box",    // include padding in height calc
                    padding: 2
                }}>
                {selectedItem && detailRenderer(selectedItem)}
            </Box>
        </Stack >
    )
}
