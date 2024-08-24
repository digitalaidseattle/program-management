
/**
 *  MeetingsPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Stack, Typography } from "@mui/material";
import { VentureProps } from "../../services/dasVentureService";



export const MeetingsPanel: React.FC<VentureProps> = ({ venture }) => {

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Meetings for: </Typography>
                <Typography> {venture.title}</Typography>
            </Stack>
        </Stack>
    )
};
