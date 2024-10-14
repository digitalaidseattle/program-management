/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';

// material-ui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { pmEpicService } from '../../services/pmEpicService';
import { VentureProps } from '../../services/pmVentureService';

interface DialogProps {
    open: boolean,
    handleSuccess: (resp: any | null) => void,
    handleError: (err: Error) => void
}
const EpicDialog: React.FC<DialogProps & VentureProps> = ({ open, handleSuccess, handleError, venture }) => {

    const iconBackColorOpen = 'grey.300';
    const iconBackColor = 'grey.100';

    return <Dialog
        fullWidth={true}
        open={open}
        onClose={() => handleSuccess(null)}
        PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                // Review: as unknown as Ticket
                console.log('formJson', formJson)
                pmEpicService.create(formJson)
                    .then((resp: any) => handleSuccess(resp))
                    .catch(err => handleError(err))
            },
        }}
    >
        <DialogTitle><Typography fontSize={24}>Create Epic</Typography></DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <DialogContentText>
                    Epic will be created for: {venture.name}.
                </DialogContentText>
                <Stack spacing={2}>
                    <TextField
                        id="epicName"
                        name="Epic Name"
                        type="text"
                        label="Name"
                        fullWidth
                        variant="standard"
                        required={true}
                    />
                    <TextField
                        id="epicNumber"
                        name="Epic Number"
                        type="number"
                        label="Epic Number"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        id="description"
                        name="Description"
                        type="text"
                        label="Description"
                        fullWidth
                        multiline={true}
                        minRows={4}
                    />

                </Stack>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button
                variant='outlined'
                sx={{ color: 'text.secondary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                onClick={() => handleSuccess(null)}>Cancel</Button>
            <Button
                variant='outlined'
                sx={{ color: 'text.success', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                type="submit">OK</Button>
        </DialogActions>
    </Dialog>
}
export default EpicDialog;
