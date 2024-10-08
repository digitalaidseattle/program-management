
/**
 *  meetingDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Attendance, dasAttendanceService, DASMeetingService, dasMeetingService, Meeting } from "../../services/dasMeetingService";
import { TaskGroup } from "../../services/dasTaskGroupService";
import useVolunteers from "../../services/useVolunteers";
import { Volunteer } from "../../services/dasVolunteerService";

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

const MeetingDialog: React.FC<EntityDialogProps<Meeting> & { taskGroup: TaskGroup }> = ({ open, entity, handleSuccess, handleError, taskGroup }) => {

    const [disabled, setDisabled] = useState<boolean>(true);
    const [changes, setChanges] = useState<any>({});
    const { data: volunteers } = useVolunteers();
    const [fields, setFields] = useState<any>();
    const [selectedVolunteers, setSelectedVolunteers] = useState<Volunteer[]>();

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
            recordFields["Team"] = entity.teamIds
            recordFields["Task Group discussed"] = entity.taskGroupIds
            setFields(recordFields)
        }

        if (entity && !selectedVolunteers) {
            setSelectedVolunteers(entity.attendances.map(att => volunteers.find(v => v.id === att.internalAttendeeIds[0])))
        }
    }, [entity]);



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
                .then(res => {
                    if (selectedVolunteers) {
                        const atats = selectedVolunteers.map(v => {
                            return {
                                fields: {
                                    'Meeting': [res.id],
                                    'Internal Attendee': [v.id]
                                }
                            }
                        });
                        dasAttendanceService.createAttendances(atats)
                            .then(_res => {
                                // Consider requerying meeting
                                handleSuccess(res)
                            })
                    }
                })
                .catch(e => handleError(e))
        }
        setSelectedVolunteers(undefined);
        setFields(undefined)
    }

    const change = (field: string, value: any) => {
        fields[field] = value;
        setFields(Object.assign({}, fields));
        // stringify & parse needed for string keys
        setChanges(Object.assign(changes, JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)))
        setDisabled(false);
    }

    const changedSelectedVolunteers = (ids: string[]) => {
        setSelectedVolunteers(ids.map(id => volunteers.find(v => v.id === id)));
        setDisabled(false);
    }

    return <Dialog
        fullWidth={true}
        open={open}
        onClose={() => handleSuccess(null)}
    >
        <DialogTitle><Typography fontSize={24}>Create Meeting: {taskGroup?.name}</Typography></DialogTitle>
        <DialogContent>
            {fields &&
                <Stack spacing={2} margin={2}>
                    <Grid container>
                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>
                    </Grid>
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
                    <Autocomplete
                        id="volunteers"
                        multiple
                        options={volunteers}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={selectedVolunteers}
                        onChange={(_event, newValue) => changedSelectedVolunteers(newValue.map(v => v.id))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Attendees"
                                placeholder="DAS Member"
                            />
                        )}
                    />
                    <Grid container>
                        <Grid item xs={4}>
                            <DatePicker
                                label='Start Date'
                                value={fields["Start Date/Time"]}
                                onChange={(value) => change("Start Date/Time", value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TimePicker
                                label='Start Time'
                                value={fields["Start Date/Time"]}
                                onChange={(value) => change("Start Date/Time", value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
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
                        </Grid>
                    </Grid>
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