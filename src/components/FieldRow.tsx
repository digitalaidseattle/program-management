/**
 *  FieldRow.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Grid, Typography } from "@mui/material";

export const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Grid container padding={1} spacing={1}>
        <Grid size={3}>
            <Typography variant="body2" color="text.primary"
                sx={{ height: '100%'}}>
                {label}
            </Typography>
        </Grid>
        <Grid size={9}>
            {children}
        </Grid>
    </Grid>
);