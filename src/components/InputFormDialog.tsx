/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

// material-ui

interface InputFormDialogProps<T> {
    open: boolean;
    title: string;
    inputFields: InputOption[];
    entity: T;
    onChange: (resp: T | null) => void;
}
function InputFormDialog<T>({ open, title, inputFields, entity, onChange }: InputFormDialogProps<T>) {

    const [dirty, setDirty] = useState<boolean>(false);
    const [clone, setClone] = useState<T>();

    useEffect(() => {
        if (entity) {
            const cloned = JSON.parse(JSON.stringify(entity));
            setDirty(false);
            setClone(cloned);
        }
    }, [entity]);

    const handleChange = (field: string, value: any) => {
        // stringify & parse needed for string keys
        const updatedChanges = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
        const merged = ({
            ...clone,
            ...updatedChanges
        });
        console.log(merged);
        setClone(merged);
        setDirty(true);
    }

    const handleSubmit = () => {
        onChange(clone!);
    }

    const handleCancel = () => {
        onChange(clone!);
    }

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => handleCancel()}>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant='h4'>{title}</Typography>
                    <InputForm
                        entity={clone}
                        inputFields={inputFields}
                        onChange={handleChange}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary' }}
                    onClick={() => handleCancel()}>Cancel</Button>
                <Button
                    variant='contained'
                    sx={{ color: 'text.success' }}
                    onClick={() => handleSubmit()}
                    disabled={!dirty}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
export default InputFormDialog;
