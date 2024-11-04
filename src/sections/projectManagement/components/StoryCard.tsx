/**
 *  TaskCard.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import Markdown from "react-markdown";
import { Story } from "../api/pmProjectService";

const STORY_STATUS_COLOR_MAP: any = {
    "Not Started": 'primary',
    "In Progress": 'primary',
    "Completed": 'success',
    "Paused": 'warning',
    "Ready for QA": 'success',
    "Blocked": 'danger'
}

export const StoryCard = (props: { story: Story }) => {

    return (
        <Card>
            <CardContent>
                <Typography><Chip
                    color={STORY_STATUS_COLOR_MAP[props.story.status]}
                    label={props.story.status} /> {props.story.name}</Typography>
                <Markdown>{props.story.description}</Markdown>
            </CardContent>
            <CardActions>
                <Button size="small">Edit</Button>
            </CardActions>
        </Card>
    );
}