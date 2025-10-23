/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Box, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type EntityListProps<T extends Entity> = {
    pageInfo: PageInfo<T>;
    toolbar?: () => any;
    listItemRenderer: (entity: T) => React.ReactNode;
    detailRenderer: (entity: T) => React.ReactNode;
}

export function EntityList<T extends Entity>({
    pageInfo, listItemRenderer, detailRenderer
}: EntityListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [selectedItem, setSelectedItem] = useState<T>();

    useEffect(() => {
        if (pageInfo) {
            if (pageInfo.rows.length > 0) {
                setSelectedIndex(0)
            }
        }
    }, [pageInfo])

    useEffect(() => {
        if (selectedIndex > -1) {
            setSelectedItem(pageInfo.rows[selectedIndex]);
            itemRefs.current[selectedIndex]?.focus();
        }
    }, [selectedIndex])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            const next = Math.min(itemRefs.current.length - 1, selectedIndex + 1);
            setSelectedIndex(next);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            const prev = Math.max(0, selectedIndex - 1);
            setSelectedIndex(prev);
        }
        // else if (event.key === "Tab") {
        //     event.preventDefault();
        //     const next = Math.min(itemRefs.current.length - 1, index + 1);
        //     itemRefs.current[next]?.focus();
        //     setSelectedIndex(next);
        // } 
        else if (event.key === "Enter") {
            setSelectedIndex(index);
        }
    };

    const setItemRef = useCallback(
        (index: number) => (el: HTMLDivElement | null) => {
            itemRefs.current[index] = el;
        },
        []
    );

    const handleFocus = (index: number) => {
        setSelectedIndex(index);
        const node = itemRefs.current[index];
        if (node && containerRef.current) {
            node.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    const handleClick = (index: number) => {
        console.log(index)
        setSelectedIndex(index);
    };

    return (
        <Stack direction="row" sx={{ height: "100vh" }}>
            <Box
                ref={containerRef}
                sx={{
                    height: "100%",             // fill parent container height
                    overflowY: "auto",          // enable vertical scroll
                    overflowX: "hidden",        // hide horizontal scroll (optional)
                    boxSizing: "border-box",    // include padding in height calc
                }}
            >
                {pageInfo.rows.map((entity, idx) =>
                (
                    <Box
                        key={idx}
                        ref={setItemRef(idx)} // ✅ typed, stable setter
                        tabIndex={0}
                        onFocus={() => handleFocus(idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onClick={() => handleClick(idx)}
                        sx={{
                            m: 0.5,
                            borderRadius: 1,
                            bgcolor: "white",
                            boxShadow: 1,
                            outline: "none",
                            "&:focus": {
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                boxShadow: "0 0 0 2px #1976d2",
                            },
                        }}
                    >
                        {listItemRenderer(entity)}
                    </Box>
                )
                )}
            </Box>
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
