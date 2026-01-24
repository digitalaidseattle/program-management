/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, OutlinedInput, Stack } from "@mui/material";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";

import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { ScrollList } from "./ScrollList";

type EntityListPageProps<T extends Entity> = {
    title: string;
    entities: T[];
    pageAction?: React.ReactNode;
    filterBy?: string;
    onFilter?: (value: string) => void;
    listItemRenderer: (entity: T) => React.ReactNode;
    detailRenderer: (entity: T) => React.ReactNode;
}

export function EntityListPage<T extends Entity>({
    title, entities = [], pageAction, filterBy, onFilter, listItemRenderer, detailRenderer
}: EntityListPageProps<T>) {
    const { id } = useParams<string>();
    const [filterValue, setFilterValue] = useState<string>('');

    const [pageInfo, setPageInfo] = useState<PageInfo<T>>({ rows: [], totalRowCount: 0 });
    const [selectedItem, setSelectedItem] = useState<T>();

    useEffect(() => {
        setFilterValue(filterBy!);
    }, [filterBy]);

    useEffect(() => {
        setPageInfo({ rows: entities, totalRowCount: entities.length });
        setSelectedItem(entities.find(e => e.id === id) ?? entities[0]);
    }, [id, entities]);

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
                            {onFilter && <OutlinedInput
                                value={filterValue}
                                onChange={(evt) => onFilter(evt.target.value)}
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        onClick={() => onFilter("")}
                                        edge="end"
                                    >
                                        <CloseCircleOutlined />
                                    </IconButton>
                                </InputAdornment>} />}
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
