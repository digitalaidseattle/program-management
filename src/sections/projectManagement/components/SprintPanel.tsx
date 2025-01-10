
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { PlusCircleOutlined } from "@ant-design/icons";
<<<<<<< Updated upstream
import { ButtonGroup, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../../components/contexts/LoadingContext";
import { pmProjectService, ProjectProps } from "../api/pmProjectService";
import SprintBoard from "./SprintBoard";
=======
import { Button, ButtonGroup, Card, CardActions, CardContent, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { ReactNode, useContext, useEffect, useState } from "react";
import { pmTaskService, Task } from "../api/pmProjectService";
import { pmSprintService, Sprint } from "../api/pmSprintService";
import { ProjectContext } from "./ProjectContext";
import { pmContributorService } from "../api/pmContributorService";
import { DDCategory, DDType, DragAndDrop } from "@digitalaidseattle/draganddrop";
import { LoadingContext } from "@digitalaidseattle/core";
>>>>>>> Stashed changes

// type SprintCardProps = {
//     sprint: any,
// };

<<<<<<< Updated upstream
// const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => (
//     <MainCard contentSX={{ p: 2.25 }}>
//         <Stack spacing={0.5}>
//             <Typography variant="h4">
//                 {sprint.name}
//             </Typography>
//             <Grid container alignItems="center">
//                 <Grid item>
//                     <Typography variant="h4" color="textSecondary">
//                         {sprint.startDate} - {sprint.endDate}
//                     </Typography>
//                     <Typography variant="h6" color="textSecondary">
//                         {sprint.goal}
//                     </Typography>
//                 </Grid>
//             </Grid>
//         </Stack>
//     </MainCard>
// );
=======
    return (
        <Card sx={{ pointerEvents: 'auto' }}>
            <CardContent>
                <Stack gap={1}>
                    <Typography>{props.task.name}</Typography>
                    <Typography fontWeight={700}>{props.task.assignees}</Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {
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
>>>>>>> Stashed changes

export const SprintPanel: React.FC<ProjectProps> = ({ project: venture }) => {
    const { setLoading } = useContext(LoadingContext);
    const [sprints, setSprints] = useState<any[]>([]);
    const [sprint, setSprint] = useState<any>();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            pmProjectService.getSprints(venture)
                .then((sps: any[]) => {
                    setSprints(sps)
                    setSprint(currentSprint(sps))
                })
                .finally(() => setLoading(false))
        }
    }, [venture])

    const currentSprint = (sprints: any[]) => {
        return sprints.length > 0 ? sprints[0].id : undefined
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
                        value={sprint}
                        label="Age"
                        onChange={(evt) => console.log(evt)}
                    >
                        {sprints.map(s => <MenuItem value={s.id}>{s.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </ButtonGroup>
<<<<<<< Updated upstream
            {sprint && <SprintBoard sprint={sprints.find(s => s.id === sprint)} />}
=======
            <DragAndDrop
                onChange={(c: Map<string, unknown>, t: Task) => handleChange(c, t)}
                items={tasks}
                categories={categories}
                isCategory={isCategory}
                cardRenderer={cellRender}
            />
>>>>>>> Stashed changes
        </Stack>
    )
};
