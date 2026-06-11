/**
 *  CardContainer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Card, CardContent, CardHeader, Grid, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export type CardContainerProps = {
    title: string;
    items: ReactNode[];
    headerSx?: any;
    action?: ReactNode
}

export const CardContainer: React.FC<CardContainerProps> = ({ title, items, headerSx: cardHeaderSx, action }) => {

    return (
        <>
            <Card>
                <CardHeader
                    slotProps={{ title: { fontSize: 16 } }}
                    sx={{
                        ...cardHeaderSx
                    }}
                    title={title}
                    action={action}>
                </CardHeader>
                <CardContent >
                    <Stack gap={2} margin={2}>
                        <Grid container gap={2}>
                            {(items.length === 0) && <Typography>No matching items.</Typography>}
                            {items.map((item, idx) =>
                            (<Paper
                                key={idx}
                                sx={{
                                    position: "relative", // make card the positioning parent
                                    overflow: "visible", // allow the floating icon to overflow the card
                                    borderRadius: 2,
                                    p: 0,
                                }}
                                elevation={3}>
                                {item}
                            </Paper>
                            ))}
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}