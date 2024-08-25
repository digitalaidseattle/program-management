/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';

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
import { Task } from '../../services/dasTaskGroupService';
import useAppConstants from '../../services/useAppConstants';

interface TaskDialogProps {
    open: boolean,
    task: Task | undefined,
    handleSuccess: (resp: Task | null) => void,
    handleError: (err: Error) => void
}
const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, handleSuccess }) => {

    // const { user } = useContext(UserContext)
    const { data: sources } = useAppConstants('TASK-STATUS');
    // const [setStatus] = useState<string>("inbox");
    const iconBackColorOpen = 'grey.300';
    const iconBackColor = 'grey.100';

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
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select
                                id="status"
                                name="status"
                                value={task.status}
                                label="Status"
                                fullWidth
                            >
                                {sources.map((s, idx: number) => <MenuItem key={idx} value={s.value}>{s.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            id="driEmail"
                            name="driEmail"
                            type="text"
                            label="DRI Email"
                            value={task.driEmail}
                            fullWidth
                            variant="standard"
                            required={true}
                        />
                        <TextField
                            id="requestDetails"
                            name="requestDetails"
                            type="text"
                            value={task.requestDetails}
                            label="Description"
                            fullWidth
                            variant="standard"
                            multiline
                            rows={12}
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
                type="submit">OK</Button>
        </DialogActions>
    </Dialog>
}
export default TaskDialog;
