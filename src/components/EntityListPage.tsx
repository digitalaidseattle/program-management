/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity, Identifier } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Box, Card, CardContent, CardHeader, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ScrollList } from "./ScrollList";
import { useParams } from "react-router-dom";

type EntityListPageProps<T extends Entity> = {
    title: string;
    entities: T[];
    pageAction?: React.ReactNode;
    listItemRenderer: (entity: T) => React.ReactNode;
    detailRenderer: (entity: T) => React.ReactNode;
}

export function EntityListPage<T extends Entity>({
    title, entities = [], pageAction, listItemRenderer, detailRenderer
}: EntityListPageProps<T>) {
    const { id } = useParams<string>();
    const { id } = useParams<string>();

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
                if (id) {
                    const found = pageInfo.rows.find(e => e.id === id)
                    setSelectedItem(found ?? pageInfo.rows[0]);
                } else {
                    setSelectedItem(pageInfo.rows[0]);
                }
            }
                if (id) {
                    const found = pageInfo.rows.find(e => e.id === id)
                    setSelectedItem(found ?? pageInfo.rows[0]);
                } else {
                    setSelectedItem(pageInfo.rows[0]);
                }
            }
        }
    }, [pageInfo]);

    useEffect(() => {
        if (selectedItem) {
            window.history.pushState({}, '', `${selectedItem.id}`)
        }
    }, [selectedItem]);

    return (
        <Card >
            <CardHeader
                slotProps={{ title: { fontSize: 24 } }} // TODO move magic number into style constants
                title={title}
                action={pageAction} />
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
