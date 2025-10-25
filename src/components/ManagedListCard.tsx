import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { Card, CardContent, CardHeader, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { ReactNode, useState } from "react";


export type ManagedListCardProps = {
    title: string;
    items: ReactNode[];
    cardHeaderSx?: any;
    onAdd?: () => void;
    onDelete?: (index: number) => Promise<boolean>
}

export const ManagedListCard: React.FC<ManagedListCardProps> = ({ title, items, cardHeaderSx: cardHeaderSx, onAdd, onDelete }) => {

    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(-1);

    function confirmDelete(index: number) {
        return () => {
            setOpenConfirmation(true);
            setIndex(index)
        }
    }

    function handleConfirm() {
        if (index > 0) {
            onDelete && onDelete(index)
                .then((success) => setOpenConfirmation(!success))
        }
    }

    return (
        <Card>
            <CardHeader
                titleTypographyProps={{ fontSize: 24 }}
                sx={{
                    ...cardHeaderSx
                }}
                title={title}
                avatar={
                    onAdd && <IconButton aria-label={`add ${title}`}
                        color="primary"
                        onClick={() => onAdd()}>
                        <PlusCircleOutlined />
                    </IconButton>
                }>
                <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant='h3'>{title}</Typography>
                    <IconButton color="primary" aria-label="add" >
                        <PlusCircleOutlined />
                    </IconButton>
                </Stack>
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
                               {onDelete &&  <IconButton
                                    onClick={confirmDelete(idx)}
                                    aria-label="favorite"
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: -12,
                                        right: -12,
                                        backgroundColor: "background.paper",
                                        boxShadow: 3,
                                        zIndex: 2,
                                    }}>
                                    <CloseCircleOutlined />
                                </IconButton>}
                                {item}
                            </Paper>
                            ))}
                        </Grid>
                    </Grid>
                </Stack>
                <ConfirmationDialog
                    title="Confirm removing item"
                    open={openConfirmation}
                    message={"Are you sure?"}
                    handleConfirm={handleConfirm}
                    handleCancel={() => setOpenConfirmation(false)} />
            </CardContent>
        </Card>
    );
}