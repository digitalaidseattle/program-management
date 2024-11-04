/**
 *  TaskCard.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import Markdown from "react-markdown";
import { Task } from "../api/pmProjectService";
import { useContributors } from "../api/useContributors";
import { useEffect, useState } from "react";
import { Contributor } from "../api/pmContributorService";

const TASK_STATUS_COLOR_MAP: any = {
    'Completed': 'success',
    'Paused': 'primary',
    'In Progress': 'primary',
    "Not Started": 'primary',
    "By Design": 'danger',
    "Approved": 'success',
    "Ready for QA": 'success',
    "Blocked": 'danger',
    "Canceled": 'warning',
}

export const TaskCard = (props: { task: Task }) => {

    const contributors = useContributors();
    const [assignees, setAssignees] = useState<Contributor[]>([]);

    useEffect(() => {
        if (props.task && contributors.status == 'fetched') {
            setAssignees(contributors.data.filter(c => props.task.assigneeIds? props.task.assigneeIds.includes(c.id): false))
        }
    }, [contributors, props])
    return (
        <Card>
            <CardContent>
                <Typography><Chip
                    color={TASK_STATUS_COLOR_MAP[props.task.status]}
                    label={props.task.status} /> {props.task.name}</Typography>
                <Markdown>{props.task.description}</Markdown>
                <Typography><strong>Assignee:</strong> {assignees.map(a => a.name).join(', ')}</Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Edit</Button>
            </CardActions>
        </Card>
    );
}