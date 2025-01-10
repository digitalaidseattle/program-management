
/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Grid, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Contributor, pmContributorService } from "../api/pmContributorService";
import { ProjectContext } from "./ProjectContext";
import { MainCard } from "@digitalaidseattle/mui";
import { RefreshContext } from "@digitalaidseattle/core";


type ContributorCardProps = {
    contributor: any,
};

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor }) => (
    <MainCard contentSX={{ p: 2.25 }}>
        <Stack spacing={0.5}>
            <Typography variant="h4">
                {contributor.name}
            </Typography>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h6" color="inherit">
                        {contributor.role}
                    </Typography>
                    <Typography variant="h6" color="inherit">
                        {contributor.email}
                    </Typography>
                </Grid>
            </Grid>
        </Stack>
    </MainCard>
);


export const ContributorPanel = () => {
    const { refresh } = useContext(RefreshContext);
    const { project } = useContext(ProjectContext);

    const [contributors, setContributors] = useState<Contributor[]>([]);

    useEffect(() => {
        if (project) {
            pmContributorService.findByProject(project)
                .then(cc => setContributors(cc))
        }
    }, [project, refresh])

    const findItem = (itemId: string, items: any[]): any => {
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === itemId) {
                    return items[i]
                } else {
                    const found = findItem(itemId, items[i].children)
                    if (found) {
                        return found
                    }
                }
            }
        }
        return undefined
    }



    return (
        <Stack gap={'0.5rem'}>
            {project && contributors.map((c: any) => <ContributorCard
                key={c.id} contributor={c} />)}
        </Stack>
    )
};
