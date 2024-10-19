/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
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
import { dasStaffingService, StaffingNeed } from '../../services/dasStaffingService';
import useRoles from '../../services/useRoles';

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

const StaffingDialog: React.FC<EntityDialogProps<StaffingNeed>> = ({ open, entity: staffingNeed, handleSuccess, handleError }) => {

    const [fields, setFields] = useState<any>();
    const [disabled, setDisabled] = useState<boolean>(true);
    const [changes, setChanges] = useState<any>({});
    const { data: roles } = useRoles();

    useEffect(() => {
        if (staffingNeed) {
            const recordFields: any = {}
            recordFields["Status"] = staffingNeed.status
            recordFields["Importance"] = staffingNeed.importance
            recordFields["Timing"] = staffingNeed.timing
            recordFields["Prospective Ventures"] = staffingNeed.ventureIds
            recordFields["Role"] = staffingNeed.role
            recordFields["Volunteer Assigned"] = staffingNeed.volunteerAssigned
            recordFields["Contributor in text for website"] = staffingNeed.contributors
            setFields(recordFields)
        }
    }, [staffingNeed]);

    const change = (field: string, value: any) => {
        fields[field] = value;
        setFields(Object.assign({}, fields));
        // stringify & parse needed for string keys
        setChanges(Object.assign(changes, JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)))
        setDisabled(false);
    }

    const handleSubmit = () => {
        if (staffingNeed && staffingNeed.id) {
            dasStaffingService
                .update({
                    id: staffingNeed?.id,
                    fields: changes
                })
                .then(res => handleSuccess(res))
                .catch(e => handleError(e))
        } else {
            dasStaffingService
                .create(fields)
                .then(res => handleSuccess(res))
                .catch(e => handleError(e))
        }
        setFields(undefined)
    }

    return <Dialog
        fullWidth={true}
        open={open}
        onClose={() => handleSuccess(null)}
        PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                // const formData = new FormData(event.currentTarget);
                // Review: as unknown as Ticket
                // ticketService.create(user!, formJson as unknown as Ticket)
                //     .then((resp: Ticket) => handleSuccess(resp))
                //     .catch(err => handleError(err))
            },
        }}
    >
        <DialogTitle><Typography fontSize={24}>Staff Request</Typography></DialogTitle>
        <DialogContent>
            {fields &&
                <Stack spacing={2}>
                    <Stack spacing={2}>
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select
                                id="status"
                                name="status"
                                value={fields['Status']}
                                label="Status"
                                onChange={(evt) => change('Status', evt.target.value)}
                                fullWidth
                                required={true}
                            >
                                {dasStaffingService.STATUSES
                                    .map((v: string) =>
                                        <MenuItem key={v} value={v}>{v}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Importance</InputLabel>
                            <Select
                                id="importance"
                                name="importance"
                                value={fields['Importance']}
                                label="Importance"
                                onChange={(evt) => change('Importance', evt.target.value.toString())}
                                fullWidth
                                required={true}
                            >
                                {dasStaffingService.IMPORTANCES
                                    .map((v: string) =>
                                        <MenuItem key={v} value={v}>{v}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            id="roles"
                            multiple
                            options={roles}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={roles.filter(r => fields['Role'].includes(r.id))}
                            onChange={(_event, newValue) => change('Role', newValue.map(v => v.id))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Role"
                                    placeholder="DAS Role"
                                />
                            )}
                        />
                        <FormControl>
                            <InputLabel>Timing</InputLabel>
                            <Select
                                id="timing"
                                name="timing"
                                value={fields['Timing']}
                                label="Timing"
                                onChange={(evt) => change('Timing', evt.target.value.toString())}
                                fullWidth
                                required={true}
                            >
                                {dasStaffingService.TIMINGS
                                    .map((v: string) =>
                                        <MenuItem key={v} value={v}>{v}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            id="contributors"
                            disabled  // Disabled becuase must be assigned elsewhaere
                            name="contributors"
                            type="text"
                            value={fields["Contributor in text for website"]}
                            label="Volunteer Assigned"
                            fullWidth
                            variant="outlined"
                        />
                    </Stack>
                </Stack>
            }
        </DialogContent>
        <DialogActions>
            <Button
                variant='outlined'
                sx={{ color: 'text.secondary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                onClick={() => handleSuccess(null)}>Cancel</Button>
            <Button
                variant='outlined'
                sx={{ color: 'text.success', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                onClick={handleSubmit}
                disabled={disabled}
                type="submit">OK</Button>
        </DialogActions>
    </Dialog>
}
export default StaffingDialog;
