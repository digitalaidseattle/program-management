
/**
 *  InfoPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { RefreshContext } from "../../components/contexts/RefreshContext";
import { VentureProps } from "../../services/dasVentureService";
import { projectService } from "../../services/projectService";
import { EditBlock } from "../../components/EditBlock";

export const InfoPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setRefresh } = useContext(RefreshContext);

    const saveProblem = (text: string) => {
        projectService.update(venture, { 'Problem (for DAS website)': text })
            .then(() => setRefresh(0))
    }

    const saveSolution = (text: string) => {
        projectService.update(venture, { 'Solution (for DAS website)': text })
            .then(() => setRefresh(0))
    }

    const saveImpact = (text: string) => {
        projectService.update(venture, { 'Impact (for DAS website)': text })
            .then(() => setRefresh(0))
    }

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
            <EditBlock label="Problem" value={venture.problem} save={saveProblem} />
            <EditBlock label="Solution" value={venture.solution} save={saveSolution} />
            <EditBlock label="Impact" value={venture.impact} save={saveImpact} />
        </Stack>
    )
};
