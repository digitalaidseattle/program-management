/**
 *  FeatureCard.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import Markdown from "react-markdown";
import { Epic } from "../api/pmProjectService";

const FEATURE_STATUS_COLOR_MAP: any = {
    "Not Started": 'primary',
    "In progress": 'warning',
    "Completed": 'success',
    "Paused": 'warning',
    "Blocked": 'danger'
}

export const EpicCard = (props: { epic: Epic }) => {

    return (
        <Card>
            <CardContent>
                <Typography><Chip
                    color={FEATURE_STATUS_COLOR_MAP[props.epic.status]}
                    label={props.epic.status} /> {props.epic.name}</Typography>
                <Markdown>{props.epic.description}</Markdown>
            </CardContent>
            <CardActions>
                <Button size="small">Edit</Button>
            </CardActions>
        </Card>
    );
}