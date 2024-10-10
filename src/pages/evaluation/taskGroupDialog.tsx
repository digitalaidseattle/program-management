
/**
 *  taskGroupDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DASTaskGroupService, dasTaskGroupService, TaskGroup } from "../../services/dasTaskGroupService";
import useVolunteers from "../../services/useVolunteers";
import { useDisciplines } from "../../services/dasDisciplinesService";

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';

const TaskGroupDialog: React.FC<EntityDialogProps<TaskGroup>> = ({ open, entity: taskGroup, handleSuccess, handleError }) => {
    const { data: volunteers } = useVolunteers();
    const { data: disciplines } = useDisciplines();

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
            recordFields["Disciplines required"] = taskGroup.disciplinesRequiredId
            recordFields["Venture Project Manager"] = taskGroup.ventureProjectManagerIds
            recordFields["Venture Product Manager"] = taskGroup.ventureProductManagerIds
            recordFields["Contributor PdM"] = taskGroup.contributorPdMIds
            setFields(recordFields)
        }
    }, [taskGroup]);

    const change = (field: string, value: any) => {
        fields[field] = value;
        setFields(Object.assign({}, fields));
        // stringify & parse needed for string keys
        setChanges(Object.assign(changes, JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)))
        setDisabled(false);
    }

    const handleSubmit = () => {
        dasTaskGroupService
            .update({
                id: taskGroup?.id,
                fields: changes
            })
            .then(res => handleSuccess(res[0]))
            .catch(e => handleError(e))
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
                    <Grid container>
                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>
                    </Grid>
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
                        id="responsible"
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
                    <Autocomplete
                        id="ventureProjecttManager"
                        multiple
                        options={volunteers}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={volunteers.filter(v => fields['Venture Project Manager'].includes(v.id))}
                        onChange={(_event, newValue) => change('Venture Project Manager', newValue.map(v => v.id))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Venture Project Manager"
                                placeholder="DAS Member"
                            />
                        )}
                    />
                    <Autocomplete
                        id="ventureProductManager"
                        multiple
                        options={volunteers}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={volunteers.filter(v => fields['Venture Product Manager'].includes(v.id))}
                        onChange={(_event, newValue) => change('Venture Product Manager', newValue.map(v => v.id))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Venture Product Manager"
                                placeholder="DAS Member"
                            />
                        )}
                    />
                    <Autocomplete
                        id="contributorProductManager"
                        multiple
                        options={volunteers}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={volunteers.filter(v => fields['Contributor PdM'].includes(v.id))}
                        onChange={(_event, newValue) => change('Contributor PdM', newValue.map(v => v.id))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Contributor Product Manager"
                                placeholder="DAS Member"
                            />
                        )}
                    />
                    <Autocomplete
                        id="disciplines"
                        multiple
                        options={disciplines}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={disciplines.filter(d => fields['Disciplines required'].includes(d.id))}
                        onChange={(_event, newValue) => change('Disciplines required', newValue.map(d => d.id))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Disciplines Required"
                                placeholder="Project Manager"
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