/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Box, Card, CardContent, CardHeader, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { ScrollList } from "./ScrollList";

type EntityListPageProps<T extends Entity> = {
    title: string;
    fetchData: () => Promise<T[]>;
    listItemRenderer: (entity: T) => React.ReactNode;
    detailRenderer: (entity: T) => React.ReactNode;
}

export function EntityListPage<T extends Entity>({
    title, fetchData, listItemRenderer, detailRenderer
}: EntityListPageProps<T>) {

    const [pageInfo, setPageInfo] = useState<PageInfo<T>>({ rows: [], totalRowCount: 0 });
    const [selectedItem, setSelectedItem] = useState<T>();

    useEffect(() => {
        if (fetchData) {
            fetchData().then(data => {
                setPageInfo({ rows: data, totalRowCount: data.length });
            });
        }
    }, []);


    useEffect(() => {
        if (pageInfo) {
            if (pageInfo.rows.length > 0) {
                setSelectedItem(pageInfo.rows[0])
            }
        }
    }, [pageInfo])
    return (
        <Card >
            <CardHeader
                slotProps={{ title: { fontSize: 24 } }} // TODO move magic number into style constants
                title={title} />
            <CardContent sx={{ p: 0 }}>
                <Grid container>
                    <Grid size={3}>
                        <Stack sx={{ height: "100vh" }}>
                            <ScrollList
                                items={pageInfo.rows}
                                listItemRenderer={listItemRenderer}
                                selectedItem={selectedItem}
                                onSelect={setSelectedItem}
                            />
                        </Stack >
                    </Grid>
                    <Grid size={9}>
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
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

}
