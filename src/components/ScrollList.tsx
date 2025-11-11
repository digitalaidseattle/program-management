/**
 *  ScrollList.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Box, Stack, SxProps } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type ScrollListProps<T> = {
    items: T[];
    listItemRenderer: (entity: T) => React.ReactNode;
    direction?: 'row' | 'column';
    sx?: SxProps;
    selectedItem?: T;
    onSelect?: (item: T) => void;
}

export function ScrollList<T,>({ items, listItemRenderer, direction = 'column', sx, selectedItem, onSelect }: ScrollListProps<T>) {

    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    useEffect(() => {
        const found = items.findIndex(i => i === selectedItem);
        setSelectedIndex(found);
    }, [items, selectedItem])

    useEffect(() => {
        if (selectedIndex > -1) {
            itemRefs.current[selectedIndex]?.focus();
            onSelect && onSelect(items[selectedIndex])
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
        setSelectedIndex(index);
    };

    function getSx(): SxProps {
        return ('row' === direction)
            ? ({
                width: "100%",             // fill parent container height
                overflowY: "hidden",          // enable vertical scroll
                overflowX: "auto",        // hide horizontal scroll (optional)
                boxSizing: "border-box",    // include padding in height calc
                ...sx
            })
            : ({
                height: "100%",             // fill parent container height
                overflowY: "auto",          // enable vertical scroll
                overflowX: "hidden",        // hide horizontal scroll (optional)
                boxSizing: "border-box",    // include padding in height calc
                ...sx
            });
    }

    return (
        <Stack
            direction={direction}
            ref={containerRef}
            sx={getSx()}
        >
            {items.map((entity, idx) =>
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
                        cursor: onSelect ? 'pointer' : 'default',
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
        </Stack>
    )
}
