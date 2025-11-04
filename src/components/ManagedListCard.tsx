import { PlusCircleOutlined } from "@ant-design/icons";
import { SelectItemDialog } from "@digitalaidseattle/mui";
import { Card, CardContent, CardHeader, Grid, IconButton, Paper, Stack } from "@mui/material";
import { ReactNode, useState } from "react";

export type ManagedListCardProps = {
    title: string;
    items: ReactNode[];
    headerSx?: any;
    addOpts?: {
        title: string;
        available: { label: string, value: string }[];
        handleAdd: (id: string | null | undefined) => void;
    }
}

export const ManagedListCard: React.FC<ManagedListCardProps> = ({ title, items, headerSx: cardHeaderSx, addOpts }) => {
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

    function handSubmit(selected: string | null | undefined) {
        if (addOpts) {
            addOpts.handleAdd(selected);
            setShowAddDialog(false);
        }
    }

    return (
        <>
            <Card>
                <CardHeader
                    titleTypographyProps={{ fontSize: 24 }}
                    sx={{
                        ...cardHeaderSx
                    }}
                    title={title}
                    action={
                        addOpts && <IconButton aria-label={`add ${title}`}
                            color="primary"
                            onClick={() => setShowAddDialog(true)}>
                            <PlusCircleOutlined />
                        </IconButton>
                    }
                >
                </CardHeader>
                <CardContent >
                    <Stack gap={2} margin={2}>
                        <Grid container gap={2}>
                            <Grid container gap={2}>
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
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>
            {addOpts && <SelectItemDialog
                open={showAddDialog}
                options={{ title: addOpts.title }}
                records={addOpts.available}
                onSubmit={handSubmit}
                onCancel={() => setShowAddDialog(false)} />
            }
        </>
    );
}