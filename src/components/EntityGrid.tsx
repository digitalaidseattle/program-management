/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity, PageInfo } from "@digitalaidseattle/core";
import { Grid } from "@mui/material";

type EntityGridProps<T extends Entity> = {
    pageInfo: PageInfo<T>;
    onChange: (queryModel: any) => void;
    cardRenderer: (entity: T) => React.ReactNode;
}

export function EntityGrid<T extends Entity>({
    pageInfo,  cardRenderer
}: EntityGridProps<T>) {
    return (
        <Grid container gap={2}>
            {pageInfo.rows.map(entity => cardRenderer(entity))}
        </Grid>
    )
}
