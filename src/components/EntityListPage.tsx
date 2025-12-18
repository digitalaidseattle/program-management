/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { CloseCircleOutlined } from "@ant-design/icons";
import { Box, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, OutlinedInput, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Entity } from "@digitalaidseattle/core";
=======
import { Entity, Identifier } from "@digitalaidseattle/core";
>>>>>>> 4815893 (reference list page urls)
import { PageInfo } from "@digitalaidseattle/supabase";
import { ScrollList } from "./ScrollList";
=======
import { Entity } from "@digitalaidseattle/core";
=======
import { Entity, Identifier } from "@digitalaidseattle/core";
>>>>>>> 5b1aa96 (reference list page urls)
import { PageInfo } from "@digitalaidseattle/supabase";
import { Box, Card, CardContent, CardHeader, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
>>>>>>> df7d938 (filter entity list)
import { useParams } from "react-router-dom";
import { ScrollList } from "./ScrollList";
import { useParams } from "react-router-dom";

type EntityListPageProps<T extends Entity> = {
    title: string;
    entities: T[];
    pageAction?: React.ReactNode;
<<<<<<< HEAD
    filterBy?: string;
    onFilter?: (value: string) => void;
=======
>>>>>>> df7d938 (filter entity list)
    listItemRenderer: (entity: T) => React.ReactNode;
    detailRenderer: (entity: T) => React.ReactNode;
}

export function EntityListPage<T extends Entity>({
<<<<<<< HEAD
    title, entities = [], pageAction, filterBy, onFilter, listItemRenderer, detailRenderer
=======
    title, entities = [], pageAction, listItemRenderer, detailRenderer
>>>>>>> df7d938 (filter entity list)
}: EntityListPageProps<T>) {
    const { id } = useParams<string>();
<<<<<<< HEAD
<<<<<<< HEAD
    const [filterValue, setFilterValue] = useState<string>('');
=======
>>>>>>> 4815893 (reference list page urls)
=======
    const { id } = useParams<string>();
>>>>>>> 5b1aa96 (reference list page urls)

    const [pageInfo, setPageInfo] = useState<PageInfo<T>>({ rows: [], totalRowCount: 0 });
    const [selectedItem, setSelectedItem] = useState<T>();

    useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
        setFilterValue(filterBy!);
    }, [filterBy]);
=======
        setPageInfo({ rows: entities, totalRowCount: entities.length });
    }, [entities]);
>>>>>>> df7d938 (filter entity list)
=======
        if (fetchData) {
            fetchData().then(data => {
                setPageInfo({ rows: data, totalRowCount: data.length });
            });
        }
    }, []);
>>>>>>> 5b1aa96 (reference list page urls)

<<<<<<< HEAD
    useEffect(() => {
        setPageInfo({ rows: entities, totalRowCount: entities.length });
        setSelectedItem(entities.find(e => e.id === id) ?? entities[0]);
    }, [id, entities]);

=======
>>>>>>> 4815893 (reference list page urls)
    useEffect(() => {
        if (pageInfo) {
            if (pageInfo.rows.length > 0) {
                if (id) {
                    const found = pageInfo.rows.find(e => e.id === id)
                    setSelectedItem(found ?? pageInfo.rows[0]);
                } else {
                    setSelectedItem(pageInfo.rows[0]);
                }
<<<<<<< HEAD
            }
            if (id) {
                const found = pageInfo.rows.find(e => e.id === id)
                setSelectedItem(found ?? pageInfo.rows[0]);
            } else {
                setSelectedItem(pageInfo.rows[0]);
=======
>>>>>>> 4815893 (reference list page urls)
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
