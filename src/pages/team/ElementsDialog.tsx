/**
 *  ForecastsDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { PlusCircleOutlined } from '@ant-design/icons';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { Entity } from '@digitalaidseattle/core';
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import { CARD_HEADER_SX } from '.';

interface ElementsDialogProps<T extends Entity> {
    open: boolean;
    elements: T[];
    displayOptions: {
        columns: GridColDef<T[][number]>[];
        inputFields: InputOption[];
        dialogTitle: string;
        typeName: string;
        pluralName: string;
    };
    newFunction: () => T;
    onSave: (element: T, isNew: boolean) => void;
    onClose: () => void;
}

function ElementsDialog<T extends Entity>({ open, elements, displayOptions, newFunction, onSave, onClose }: ElementsDialogProps<T>) {

    const [selected, setSelected] = useState<T>();
    const [cloned, setCloned] = useState<T>();
    const [isNew, setIsNew] = useState<boolean>(false);
    const [dirty, setDirty] = useState<boolean>(false);

    useEffect(() => {
        if (selected) {
            setSelected(elements.find(f => f.id === selected.id));
            setDirty(false);
        }
    }, [elements]);

    useEffect(() => {
        if (selected) {
            setCloned({ ...selected });
        }
    }, [selected]);

    const columns: GridColDef<T[][number]>[] = [
        {
            field: 'description',
            headerName: 'Description',
            width: 300
        },
        {
            field: 'end_date',
            headerName: 'End Date'
        }
    ]

    const inputFields: InputOption[] = [
        {
            label: 'Description',
            name: 'description',
            type: 'string',
            disabled: false
        },
        {
            name: 'start_date',
            label: 'Start Date',
            type: 'date',
            disabled: false
        },
        {
            name: 'end_date',
            label: 'End Date',
            type: 'date',
            disabled: false
        },
        {
            name: 'health_rating',
            label: 'Health',
            type: 'rating',
            disabled: false,
        }
    ]

    function addElement(): void {
        setSelected(newFunction);
        setIsNew(true)
    }

    const handleChange = (field: string, value: any) => {
        if (cloned) {
            const changed = JSON.parse(`{ "${field}": "${value}" }`);
            setCloned({ ...cloned, ...changed });
            setDirty(true);
        }
    }
    const handleSave = () => {
        if (cloned) {
            onSave(cloned, isNew);
        }
    }
    const handleClose = () => {
        onClose();
    }

    function handleRowClick(params: GridRowParams<any>): void {
        setSelected(elements.find(f => f.id === params.id));
        setIsNew(false);
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'lg'}
            open={open}
            onClose={() => handleClose()}>
            <DialogTitle sx={{ fontSize: 20, backgroundColor: CARD_HEADER_SX }}>{displayOptions.dialogTitle}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid size={4}>
                        <Stack direction={'row'} alignItems={'center'}>
                            <IconButton onClick={() => addElement()}>
                                <PlusCircleOutlined />
                            </IconButton>
                            {`New ${displayOptions.typeName}`}
                        </Stack>
                        <Box height={400}>
                            <DataGrid
                                pagination={true}
                                columns={columns}
                                rows={elements}
                                pageSizeOptions={[5]}   // 👈 only 5 rows per page
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                                }}
                                disableRowSelectionOnClick={true}
                                onRowClick={handleRowClick}
                            />
                        </Box>
                    </Grid>
                    <Grid size={8}>
                        {cloned &&
                            <Card>
                                <CardHeader
                                    title={`${displayOptions.typeName}`} />
                                <CardContent>
                                    <InputForm entity={cloned}
                                        inputFields={inputFields}
                                        onChange={handleChange} />
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant='contained'
                                        sx={{ color: 'text.success' }}
                                        disabled={!dirty}
                                        onClick={() => handleSave()}>Save</Button>
                                </CardActions>
                            </Card>
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    sx={{ color: 'text.success' }}
                    onClick={() => handleClose()}>Done</Button>
            </DialogActions>
        </Dialog>
    )
}
export default ElementsDialog;


