
/**
 *  meetingDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { DASMeetingService, dasMeetingService, Meeting } from "../../services/dasMeetingService";
import { TaskGroup } from "../../services/dasTaskGroupService";

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

const MeetingDialog: React.FC<EntityDialogProps<Meeting> & { taskGroup: TaskGroup }> = ({ open, entity, handleSuccess, handleError, taskGroup }) => {

    const [fields, setFields] = useState<any>();
    const [disabled, setDisabled] = useState<boolean>(true);
    const [changes, setChanges] = useState<any>({});

    useEffect(() => {
        if (entity && !fields) {
            const recordFields: any = {}
            recordFields["Topics"] = entity.topics
            recordFields["type"] = entity.type
            recordFields["Created via"] = entity.createdVia
            recordFields["Meeting purpose"] = entity.purpose
            recordFields["Topics"] = entity.topics
            recordFields["Meeting duration in minutes"] = entity.duration
            recordFields["Start Date/Time"] = entity.startDateTime
            setFields(recordFields)
        }
    }, [entity, open]);

    const handleCancel = () => {
        setFields(undefined);
        handleSuccess(null);
    }

    const handleSubmit = () => {
        if (entity && entity.id) {
            dasMeetingService
                .update({
                    id: entity?.id,
                    fields: changes
                })
                .then(res => handleSuccess(res))
                .catch(e => handleError(e))
        } else {
            dasMeetingService
                .create(fields)
                .then(res => handleSuccess(res))
                .catch(e => handleError(e))
        }
        setFields(undefined)
    }

    const change = (field: string, value: any) => {
        fields[field] = value;
        setFields(Object.assign({}, fields));
        // stringify & parse needed for string keys
        setChanges(Object.assign(changes, JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)))
        setDisabled(false);
    }

    return <Dialog
        fullWidth={true}
        open={open}
        onClose={() => handleSuccess(null)}
    >
        <DialogTitle><Typography fontSize={24}>Create Meeting</Typography></DialogTitle>
        <DialogContent>
            {fields &&
                <Stack spacing={2} margin={2}>
                    <FormControl fullWidth>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type-select"
                            value={fields["type"]}
                            label="Type"
                            disabled={true}
                            required={true}
                            onChange={(evt) => change("type", evt.target.value)}
                        >
                            {DASMeetingService.TYPES
                                .map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="created-via-label">Created Via</InputLabel>
                        <Select
                            labelId="created-via-label"
                            id="created-via-select"
                            value={fields["Created via"]}
                            label="Created Via"
                            disabled={true}
                            required={true}
                            onChange={(evt) => change("Created via", evt.target.value)}
                        >
                            {DASMeetingService.CREATION_TYPES
                                .map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField
                        id="purpose"
                        name="purpose"
                        type="text"
                        value={fields["Meeting purpose"]}
                        label="Meeting Purpose"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        required={true}
                        onChange={(evt) => change("Meeting purpose", evt.target.value)}
                    />
                    <TextField
                        id="topics"
                        name="topics"
                        type="text"
                        value={fields["Topics"]}
                        label="Meeting Topics"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        required={true}
                        onChange={(evt) => change("Topics", evt.target.value)}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="duration-label">Meeting duration in minutes</InputLabel>
                        <Select
                            labelId="duration-label"
                            id="duration-select"
                            value={fields["Meeting duration in minutes"]}
                            label="Meeting duration in minutes"
                            required={true}
                            onChange={(evt) => change("Meeting duration in minutes", evt.target.value)}
                        >
                            {DASMeetingService.DURATIONS
                                .map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Stack direction={'row'} spacing={'1rem'}>
                        <DatePicker
                            label='Start Date'
                            value={fields["Start Date/Time"]}
                            onChange={(value) => change("Start Date/Time", value)}
                        />
                        <TimePicker
                            label='Start Time'
                            value={fields["Start Date/Time"]}
                            onChange={(value) => change("Start Date/Time", value)}
                        />
                    </Stack>
                </Stack>
            }
        </DialogContent>
        <DialogActions>
            <Button
                variant='outlined'
                sx={{ color: 'text.secondary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                onClick={handleCancel}>Cancel</Button>
            <Button
                variant='outlined'
                sx={{ color: 'text.success', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                onClick={handleSubmit}
                disabled={disabled}
                type="submit">OK</Button>
        </DialogActions>
    </Dialog>
}
export default MeetingDialog;