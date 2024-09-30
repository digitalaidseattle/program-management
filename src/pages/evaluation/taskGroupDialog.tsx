
/**
 *  taskGroupDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DASTaskGroupService, dasTaskGroupService, TaskGroup } from "../../services/dasTaskGroupService";
import useVolunteers from "../../services/useVolunteers";

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

interface TaskGroupDialogProps {
    open: boolean,
    taskGroup: TaskGroup,
    handleSuccess: (resp: TaskGroup | null) => void,
    handleError: (err: Error) => void
}
const TaskGroupDialog: React.FC<TaskGroupDialogProps> = ({ open, taskGroup, handleSuccess, handleError }) => {
    const { data: volunteers } = useVolunteers();

    const [fields, setFields] = useState<any>();
    const [disabled, setDisabled] = useState<boolean>(true);
    const [changes, setChanges] = useState<any>({});

    useEffect(() => {
        if (taskGroup) {
            const recordFields: any = {}
            recordFields["Task Group name"] = taskGroup.name
            recordFields["Drive URL"] = taskGroup.driveUrl
            recordFields["Request details"] = taskGroup.requestDetails
            recordFields["Priority"] = taskGroup.priority ?? ''
            recordFields["Status"] = taskGroup.status ?? ''
            recordFields["Responsible"] = taskGroup.responsibleIds
            setFields(recordFields)
        }
    }, [taskGroup]);

    const handleSubmit = () => {
        dasTaskGroupService
            .update({
                id: taskGroup?.id,
                fields: changes
            })
            .then(res => handleSuccess(res[0]))
            .catch(e => handleError(e))
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
        <DialogTitle><Typography fontSize={24}>Update Task Group</Typography></DialogTitle>
        <DialogContent>
            {fields &&
                <Stack spacing={2} margin={2}>
                    <TextField
                        id="name"
                        name="name"
                        type="text"
                        label="Name"
                        value={fields["Task Group name"]}
                        fullWidth
                        variant="outlined"
                        onChange={(evt) => change("Task Group name", evt.target.value)}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            id="priority-label-select"
                            value={fields["Priority"]}
                            label="Priority"
                            onChange={(evt) => change("Priority", evt.target.value)}
                        >
                            {DASTaskGroupService.PRIORITIES
                                .map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status-label-select"
                            value={fields["Status"]}
                            label="Status"
                            onChange={(evt) => change("Status", evt.target.value)}
                        >
                            {DASTaskGroupService.STATUSES
                                .map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField
                        id="gdrive"
                        name="gdrive"
                        type="text"
                        label="G-Drive"
                        value={fields["Drive URL"]}
                        fullWidth
                        variant="outlined"
                        onChange={(evt) => change("Drive URL", evt.target.value)}
                    />
                    <Autocomplete
                        id="tags-standard"
                        multiple
                        options={volunteers}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={volunteers.filter(v => fields['Responsible'].includes(v.id))}
                        onChange={(_event, newValue) => change('Responsible', newValue.map(v => v.id))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Responsible"
                                placeholder="DAS Member"
                            />
                        )}
                    />
                    <TextField
                        id="requestDetails"
                        name="requestDetails"
                        type="text"
                        value={fields["Request details"]}
                        label="Description"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        onChange={(evt) => change("Request details", evt.target.value)}
                    />
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
export default TaskGroupDialog;