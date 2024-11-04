/**
 *  FeatureCard.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import Markdown from "react-markdown";
import { Feature } from "../api/pmProjectService";

const FEATURE_STATUS_COLOR_MAP: any = {
    "Not Started": 'primary',
    "In Progress": 'primary',
    "Completed": 'success',
    "Paused": 'warning',
    "Blocked": 'danger'
}

export const FeatureCard = (props: { feature: Feature }) => {

    return (
        <Card>
            <CardContent>
                <Typography><Chip
                    color={FEATURE_STATUS_COLOR_MAP[props.feature.status]}
                    label={props.feature.status} /> {props.feature.name}</Typography>
                <Markdown>{props.feature.description}</Markdown>
            </CardContent>
            <CardActions>
                <Button size="small">Edit</Button>
            </CardActions>
        </Card>
    );
}