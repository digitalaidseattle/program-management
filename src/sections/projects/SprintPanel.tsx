
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { PlusCircleOutlined } from "@ant-design/icons";
import { ButtonGroup, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../components/contexts/LoadingContext";
import { VentureProps, ventureService } from "../../services/dasVentureService";
import SprintBoard from "./SprintBoard";

// type SprintCardProps = {
//     sprint: any,
// };

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

export const SprintPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setLoading } = useContext(LoadingContext);
    const [sprints, setSprints] = useState<any[]>([]);
    const [sprint, setSprint] = useState<any>();

    useEffect(() => {
        if (venture) {
            setLoading(true);
            ventureService.getSprints(venture)
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
            {sprint && <SprintBoard sprint={sprints.find(s => s.id === sprint)} />}
        </Stack>
    )
};
