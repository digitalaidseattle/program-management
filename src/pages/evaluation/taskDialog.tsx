/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useEffect, useState } from 'react';

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

interface TaskDialogProps {
    open: boolean,
    taskGroup: TaskGroup,
    task: Task | undefined,
    handleSuccess: (resp: Task | null) => void,
    handleError: (err: Error) => void
}
const TaskDialog: React.FC<TaskDialogProps> = ({ open, taskGroup, task, handleSuccess }) => {

    // const { user } = useContext(UserContext)
    const { data: statuses } = useAppConstants('TASK-STATUS');
    const volunteers = useVolunteers();
    // const [setStatus] = useState<string>("inbox");
    const [changes, setChanges] = useState<any>({});
    const [fields, setFields] = useState<any>({
        title: '',
        status: '',
        requestDetails: '',
        driId: '',
        phase: 0
    });
    const [initialized, setInitialized] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [taskGroupVolunteers, setTaskGroupVolunteers] = useState<any[]>([]);

    useEffect(() => {
        if (!initialized) {
            if (volunteers.status === 'fetched' && taskGroup && task) {
                console.log("task", task);
                setTaskGroupVolunteers(volunteers.data
                    .filter(v => taskGroup.responsibleIds.includes(v.id)
                        || (task.driId && task.driId.includes(v.id)))
                )
                setInitialized(true)
            }
        }
    }, [volunteers, task, taskGroup, initialized])

    useEffect(() => {
        if (task) {
            setFields(Object.assign({}, {
                title: task.title,
                status: task.status,
                requestDetails: task.requestDetails,
                driId: (task.driId && task.driId.length > 0) ? task.driId[0] : undefined,
                phase: task.phase
            }))
        }
    }, [task])

    const changeStatus = (value: any) => {
        fields.status = value;
        setChanges(Object.assign(changes, { 'Status': value }))
        setFields(Object.assign({}, fields));
        setDisabled(false);
    }

    const changeDri = (value: any) => {
        fields.status = value;
        // setChanges(Object.assign(changes, { 'Status': value }))
        // setFields(Object.assign({}, fields));
        setDisabled(false);
    }

    const changeTitle = (value: any) => {
        fields.title = value;
        setChanges(Object.assign(changes, {'The Request': value }))
        setFields(Object.assign({}, fields));
        setDisabled(false);
    }

    const changeRequestDetails = (value: any) => {
        fields.requestDetails = value;
        setChanges(Object.assign(changes, { 'Request Details': value }))
        setFields(Object.assign({}, fields));
        setDisabled(false);
    }

    const handleSubmit = () => {
        dasTaskService
            .update({
                id: task?.id,
                fields: changes
            })
            .then(res => handleSuccess(res[0]))
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
            {task &&
                <Stack spacing={2}>
                    <DialogContentText>
                        Title: {task.title}
                    </DialogContentText>
                    <Stack spacing={2}>
                        <TextField
                            id="title"
                            name="title"
                            type="text"
                            value={fields.title}
                            label="Title"
                            fullWidth
                            variant="outlined"
                            onChange={(evt) => changeTitle(evt.target.value)}
                        />
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select
                                id="status"
                                name="status"
                                value={fields.status}
                                label="Status"
                                onChange={(evt) => changeStatus(evt.target.value)}
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
                                value={fields.driId}
                                label="DRI"
                                onChange={(evt) => changeDri(evt.target.value)}
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
                                value={fields.phase}
                                label="Phase"
                                onChange={(evt) => changeDri(evt.target.value)}
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
                            value={fields.requestDetails}
                            label="Description"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={8}
                            onChange={(evt) => changeRequestDetails(evt.target.value)}
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
