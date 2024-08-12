
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Stack, Typography } from "@mui/material";
import { VentureProps } from "../../services/dasVentureService";



export const StaffingPanel: React.FC<VentureProps> = ({ venture }) => {

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Staffing: </Typography>
            </Stack>
        </Stack>
    )
};
