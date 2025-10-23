/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useState } from 'react';

// material-ui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    Stack,
    Typography
} from '@mui/material';

type MenuItem = {
    label: string,
    value: string
}

interface AddEntityDialogProps {
    open: boolean,
    records: MenuItem[],
    options: {
        title?: string,
    }
    onSubmit: (selected: string | null | undefined) => void
    onCancel: () => void
}
const SelectToolDialog: React.FC<AddEntityDialogProps> = ({ open, records, options, onSubmit, onCancel }) => {

    const [selected, setSelected] = useState<string>('');

    const handleChange = (evt: any) => {
        setSelected(evt.target.value)
    }

    const handleSubmit = () => {
        onSubmit(selected);
    }

    return (<Dialog
        fullWidth={true}
        open={open}
        onClose={onCancel}
    >
        <DialogTitle><Typography fontSize={24}>{options ? options.title : 'Edit'}</Typography></DialogTitle>
        <DialogContent>
            <Stack spacing={2} margin={2}>
                <FormControl fullWidth>
                    <Select
                        rows={8}
                        value={selected ?? ''}
                        onChange={(evt) => handleChange(evt)} >
                        {(records ?? [])
                            .map((item: MenuItem) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button
                variant='outlined'
                sx={{ color: 'text.secondary' }}
                onClick={onCancel}>Cancel</Button>
            <Button
                variant='contained'
                sx={{ color: 'text.success' }}
                onClick={handleSubmit}
                disabled={selected!.length === 0}>OK</Button>
        </DialogActions>
    </Dialog>)
}
export default SelectToolDialog;
