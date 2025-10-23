/**
 *  EntityGrid.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity } from "@digitalaidseattle/core";
import { PageInfo } from "@digitalaidseattle/supabase";
import { Grid } from "@mui/material";

type EntityGridProps<T extends Entity> = {
    pageInfo: PageInfo<T>;
    onChange: (queryModel: any) => void;
    cardRenderer: (entity: T) => React.ReactNode;
}

export function EntityGrid<T extends Entity>({
    pageInfo, onChange, cardRenderer
}: EntityGridProps<T>) {

    console.log('EntityGrid', pageInfo)
    return (
        <Grid container gap={2}>
            {pageInfo.rows.map(entity => cardRenderer(entity))}
        </Grid>
    )
}
