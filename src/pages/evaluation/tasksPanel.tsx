
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Stack, Typography } from "@mui/material";
import { VentureProps } from "../../services/dasVentureService";
import { useContext, useEffect, useState } from "react";
import { dasTaskGroupService } from "../../services/dasTaskGroupService";
import { LoadingContext } from "../../components/contexts/LoadingContext";



export const TasksPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);
    const [taskGroup, setTaskGroup] = useState<any>();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            dasTaskGroupService.getById(venture.evaluatingTaskGroup)
                .then((tgs: any) => {
                    console.log('tgs', tgs)
                    setTaskGroup(tgs)
                })
                .finally(() => setLoading(false))
        }
    }, [venture])

    return (taskGroup &&
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Typography fontWeight={600}>Group Name: </Typography>
                    <Typography> {taskGroup.name}</Typography>
                </Stack>

            </Stack>
            {taskGroup.tasks.map((task: any, idx: number) =>
                <Stack direction="row" spacing={2} key={idx}>
                    <Typography fontWeight={600}>Task: </Typography>
                    <Typography> {task.requestDetails}</Typography>
                </Stack>
            )}
        </Stack>
    )
};
