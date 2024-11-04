
/**
 *  SprintPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, ButtonGroup, Card, CardActions, CardContent, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { LoadingContext } from "../../../components/contexts/LoadingContext";
import DragDropBoard from "../../../components/dragdrop/DragDropBoard";
import { DDCategory, DDType } from "../../../components/dragdrop/types";
import { pmTaskService, Task } from "../api/pmProjectService";
import { pmSprintService, Sprint } from "../api/pmSprintService";
import { useContributors } from "../api/useContributors";
import { ProjectContext } from "./ProjectContext";
import { pmContributorService } from "../api/pmContributorService";

export const SmallTaskCard = (props: { task: Task }) => {

    return (
        <Card sx={{ pointerEvents: 'auto' }}>
            <CardContent>
                <Stack gap={1}>
                    <Typography>{props.task.name}</Typography>
                    <Typography fontWeight={700}>{props.task.assignees}</Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={(evt) => {
                    alert(props.task.name)
                }
                }>Edit</Button>
            </CardActions>
        </Card>
    );
}

const categories: DDCategory<string>[] = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Paused', value: 'Paused' }
]
type TaskWrapper = Task & DDType

export const SprintPanel = () => {
    const { setLoading } = useContext(LoadingContext);
    const { project } = useContext(ProjectContext)

    const [tasks, setTasks] = useState<TaskWrapper[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [sprint, setSprint] = useState<Sprint>();

    const refresh = () => {
        if (project) {
            setLoading(true);
            Promise
                .all([
                    pmSprintService.findByProject(project),
                    pmTaskService.findByProject(project),
                    pmContributorService.findAll()
                ])
                .then(resps => {
                    const sps = resps[0];
                    const tts = resps[1];
                    const contributors = resps[2];
                    setSprints(sps.sort((s1, s2) => s1.name.localeCompare(s2.name)));
                    setSprint(currentSprint(sps));
                    tts.forEach(async t => {
                        t.assignees = (await contributors)
                            .filter(c => t.assigneeIds ? t.assigneeIds.includes(c.id) : false)
                            .map(a => a.name)
                    })
                    setTasks(tts);
                })
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        refresh();
    }, [project])

    const currentSprint = (sprints: any[]) => {
        return sprints.find(s => s.status === 'Active')
    }

    function handleChange(c: Map<string, unknown>, t: Task) {
        console.log(c, t)
    }

    function isCategory(item: TaskWrapper, category: DDCategory<any>): boolean {
        if (sprint && sprint.taskIds.includes(item.id)) {
            return item.status === category.value
        } else {
            if (category.value === 'backlog') {
                return !['Completed', 'Canceled'].includes(item.status)
            }
        }
        return false
    }

    function cellRender(item: TaskWrapper): ReactNode {
        return <SmallTaskCard task={item} />
    }

    function changeSprint(sid: string): void {
        setSprint(sprints.find(s => s.id === sid))
        // forces rendering sprint DDBoard
        setTasks(tasks.slice())
    }

    return (
        <Stack gap={'0.5rem'}>
            <ButtonGroup>
                <IconButton
                    disableRipple
                    color="secondary"
                    onClick={(evt) => alert(evt)}
                >
                    <PlusCircleOutlined />
                </IconButton>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Sprint</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sprint ? sprint.id : ''}
                        label="Sprint"
                        onChange={evt => changeSprint(evt.target.value)}
                    >
                        {sprints.map(s => <MenuItem value={s.id}>{s.name} {s.sprintId}</MenuItem>)}
                    </Select>
                </FormControl>
            </ButtonGroup>
            <DragDropBoard
                onChange={(c: Map<string, unknown>, t: Task) => handleChange(c, t)}
                items={tasks}
                categories={categories}
                isCategory={isCategory}
                cardRenderer={cellRender}
            />
        </Stack>
    )
};
