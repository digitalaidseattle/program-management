/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useEffect, useMemo, useState } from 'react';

// material-ui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { TaskGroup } from '../../services/dasTaskGroupService';
import { dasTaskService, Task } from '../../services/dasTaskService';
import useAppConstants from '../../services/useAppConstants';
import useVolunteers from '../../services/useVolunteers';

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';


const TaskDialog: React.FC<EntityDialogProps<Task> & { taskGroup: TaskGroup }> = ({ open, entity: task, handleSuccess, handleError, taskGroup }) => {

    const { data: statuses } = useAppConstants('TASK-STATUS');
    const volunteers = useVolunteers();

    const [fields, setFields] = useState<any>();
    const [disabled, setDisabled] = useState<boolean>(true);
    const [changes, setChanges] = useState<any>({});

    const lookup = (volunteers: any, task: Task, taskGroup: TaskGroup) => {
        if (volunteers.status === 'fetched' && taskGroup && task) {
            return volunteers.data
                .filter((v: any) => taskGroup.responsibleIds.includes(v.id)
                    || (task.driId && task.driId.includes(v.id)))
        }
    }

    const taskGroupVolunteers = useMemo(
        () => lookup(volunteers, task, taskGroup),
        [volunteers, task, taskGroup]
    )

    useEffect(() => {
        if (task) {
            const recordFields: any = {}
            recordFields["TThe Request"] = task.title
            recordFields["Status"] = task.status
            recordFields["Request Details"] = task.requestDetails
            recordFields["DRI"] = task.driId
            recordFields["Phase"] = task.phase
            setFields(recordFields)
        }
    }, [task]);

    const change = (field: string, value: any) => {
        fields[field] = value;
        setFields(Object.assign({}, fields));
        // stringify & parse needed for string keys
        setChanges(Object.assign(changes, JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)))
        setDisabled(false);
    }

    const handleSubmit = () => {
        dasTaskService
            .update({
                id: task?.id,
                fields: changes
            })
            .then(res => handleSuccess(res[0]))
            .catch(e => handleError(e))
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
        <DialogTitle><Typography fontSize={24}>Update Task</Typography></DialogTitle>
        <DialogContent>
            {fields &&
                <Stack spacing={2}>
                    <DialogContentText>
                        Title: {task.title}
                    </DialogContentText>
                    <Stack spacing={2}>
                        <TextField
                            id="title"
                            name="title"
                            type="text"
                            value={fields['The Request']}
                            label="Title"
                            fullWidth
                            variant="outlined"
                            onChange={(evt) => change('The Request', evt.target.value)}
                        />
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
                                {statuses.map((status, idx: number) =>
                                    <MenuItem key={idx} value={status.value}>
                                        {status.label}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>DRI</InputLabel>
                            <Select
                                id="dri"
                                name="dri"
                                value={fields['DRI']}
                                label="DRI"
                                onChange={(evt) => change('DRI', evt.target.value)}
                                fullWidth
                            >
                                {taskGroupVolunteers.map((vol, idx: number) =>
                                    <MenuItem key={idx} value={vol.id}>
                                        {vol.name}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Phase</InputLabel>
                            <Select
                                id="phase"
                                name="phase"
                                value={fields['Phase']}
                                label="Phase"
                                onChange={(evt) => change('Phase', evt.target.value.toString())}
                                fullWidth
                                required={true}
                            >
                                <MenuItem value={0}></MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="requestDetails"
                            name="requestDetails"
                            type="text"
                            value={fields['Request Details']}
                            label="Description"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={8}
                            onChange={(evt) => change('Request Details', evt.target.value)}
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
export default TaskDialog;
