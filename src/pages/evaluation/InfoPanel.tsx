
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Stack, Typography } from "@mui/material";
import { VentureProps } from "../../services/dasVentureService";



export const InfoPanel: React.FC<VentureProps> = ({ venture }) => {

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Partner: </Typography>
                <Typography> {venture.title}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Status: </Typography>
                <Typography> {venture.status}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Painpoint: </Typography>
                <Typography>{venture.painpoint}</Typography>
            </Stack>
            <Typography fontWeight={600}>Problem: </Typography><Typography>{venture.problem}</Typography>
            <Typography fontWeight={600}>Solution: </Typography><Typography>{venture.solution}</Typography>
            <Typography fontWeight={600}>Impact: </Typography><Typography>{venture.impact}</Typography>
        </Stack>
    )
};
