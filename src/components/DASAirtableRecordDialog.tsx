/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { FieldSet, Record } from 'airtable';
import React, { useEffect, useState } from 'react';

// material-ui
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

interface AirtableSurveyProps {
    fields: FieldSet,
    options: {
        title?: string,
        inputs: any[]
    }
    onChange: (changes: any) => void,
}
const AirtableSurvey: React.FC<AirtableSurveyProps> = ({ fields, options, onChange }) => {
    const [inputs, setInputs] = useState<any[]>([]);

    useEffect(() => {
        if (options && fields) {
            setInputs(options.inputs.map(opt => renderInputField(opt)))
        }
    }, [options, fields])

    const change = (field: string, value: any) => {
        // stringify & parse needed for string keys
        const updatedChanges = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
        onChange(updatedChanges)
    }

    const renderInputField = (option: any) => {
        switch (option.type) {
            case 'date':
                return <DatePicker
                    key={option.name}
                    label={option.label}
                    value={fields[option.fieldName] ? new Date(Date.parse(fields[option.fieldName] as string)) : new Date()}
                    onChange={(value) => change(option.fieldName, value)}
                />
            case 'lookup':
                return <Autocomplete
                    key={option.name}
                    id={option.name}
                    multiple
                    options={option.options}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={option.options.filter((v: any) => ((fields[option.fieldName] ?? []) as string[]).includes(v.id))}
                    onChange={(_event, newValue) => change(option.fieldName, newValue.map(v => v.id))}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={option.label}
                            placeholder={option.placeholder}
                        />
                    )}
                />
            case 'select':
                return (
                    <FormControl fullWidth key={option.name}>
                        <InputLabel id={option.name + '-label'}>{option.label}</InputLabel>
                        <Select
                            labelId={option.name + '-label'}
                            id={option.name}
                            value={fields[option.fieldName]}
                            label={option.label}
                            onChange={(evt) => change(option.fieldName, evt.target.value)}
                        >
                            {option.options
                                .map((item: string) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                )
            case 'text':
                return (
                    <FormControl fullWidth key={option.name}>
                        <TextField
                            key={option.name}
                            id={option.name}
                            name={option.name}
                            type="text"
                            label={option.label}
                            value={fields[option.fieldName]}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            onChange={(evt) => change(option.fieldName, evt.target.value)}
                        />
                    </FormControl>
                );
            case 'string':
            default:
                return (
                    <FormControl fullWidth key={option.name}>
                        <TextField
                            key={option.name}
                            id={option.name}
                            name={option.name}
                            disabled={option.disabled}
                            type="text"
                            label={option.label}
                            value={fields[option.fieldName]}
                            fullWidth
                            variant="outlined"
                            onChange={(evt) => change(option.fieldName, evt.target.value)}
                        />
                    </FormControl>);
        }
    }
    return (
        <>
            {inputs}
        </>
    )
}

interface AirtableDialogProps<T> {
    open: boolean,
    record: T,
    options: {
        title?: string,
        inputs: any[]
    }
    onSubmit: (changes: any) => void
    onCancel: () => void
}
const AirtableRecordDialog: React.FC<AirtableDialogProps<Record<FieldSet>>> = ({ open, record, options, onSubmit, onCancel }) => {

    const [disabled, setDisabled] = useState<boolean>(true);
    const [allChanges, setAllChanges] = useState<any>({});
    const [fields, setFields] = useState<FieldSet>({});
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        if (record && !initialized) {
            setFields(record.fields)
            setInitialized(true)
        }
    }, [record])

    const handleChange = (c: any) => {
        setAllChanges(Object.assign({}, Object.assign(allChanges, c)))
        setFields(Object.assign({}, Object.assign(fields, c)));
        setDisabled(false);
    }

    const handleSubmit = () => {
        onSubmit(allChanges);
    }

    return (initialized &&
        <Dialog
            fullWidth={true}
            open={open}
            onClose={onCancel}
        >
            <DialogTitle><Typography fontSize={24}>{options ? options.title : 'Edit'}</Typography></DialogTitle>
            <DialogContent>
                <Stack spacing={2} margin={2}>
                    <AirtableSurvey
                        fields={fields}
                        options={options}
                        onChange={handleChange} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={onCancel}>Cancel</Button>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.success', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={handleSubmit}
                    disabled={disabled}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
export default AirtableRecordDialog;
