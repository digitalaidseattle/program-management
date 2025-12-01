/**
 *  ForecastsDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { InputForm, InputOption } from '@digitalaidseattle/mui';
import { UploadImage } from '../../components/UploadImage';
import { Contact } from '../../services/dasPartnerService';
import { profileService } from '../../services/dasProfileService';

interface ContactDialogProps {
    title: string;
    open: boolean;
    entity: Contact;
    onChange: (evt: any) => void;
}

function ContactDialog({ title, open, entity, onChange }: ContactDialogProps) {
    const [dirty, setDirty] = React.useState<boolean>(false);
    const [clone, setClone] = useState<Contact>();
    const [picture, setPicture] = useState<File>();

    useEffect(() => {
        if (entity) {
            const cloned = JSON.parse(JSON.stringify(entity));
            setDirty(false);
            setClone(cloned);
        }
    }, [entity]);

    const inputFields: InputOption[] = [
        {
            label: 'Name',
            name: 'name',
            type: 'string',
            disabled: true
        },
        {
            name: 'first_name',
            label: 'First Name',
            type: 'string',
            disabled: false
        },
        {
            name: 'last_name',
            label: 'Last Name',
            type: 'string',
            disabled: false
        },
        {
            name: 'title',
            label: 'Title',
            type: 'string',
            disabled: false,
        },
        {
            name: 'email',
            label: 'Email',
            type: 'string',
            disabled: false,
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'string',
            disabled: false,
        },
        {
            name: 'location',
            label: 'Location',
            type: 'string',
            disabled: false,
        }
    ]

    const handleChange = (field: string, value: any) => {
        // stringify & parse needed for string keys
        const updatedChanges = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
        const merged = ({
            ...clone,
            ...updatedChanges
        });
        setClone(merged);
        setDirty(true);
    }

    const handleSubmit = () => {
        onChange({
            contact: clone!,
            picture: picture
        });
    }

    const handleCancel = () => {
        onChange(null);
    }

    function handlePicChange(files: File[]) {
        if (files) {
            files.forEach((file: File) => {
                setPicture(file);
                setDirty(true);
            })
        }
    }

    return (entity &&
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => handleCancel()}>
            <DialogTitle >
                <Typography variant='h4'>{title}</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={3} >
                        <UploadImage
                            url={profileService.getPicUrl(entity)}
                            onChange={handlePicChange} />
                    </Grid>
                    <Grid size={9} >
                        <InputForm
                            entity={clone}
                            inputFields={inputFields}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
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
export default ContactDialog;


