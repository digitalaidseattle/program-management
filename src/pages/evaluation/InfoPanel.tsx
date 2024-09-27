
/**
 *  InfoPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { RefreshContext } from "../../components/contexts/RefreshContext";
import { EditBlock, EditLink } from "../../components/EditBlock";
import { VentureProps } from "../../services/dasVentureService";
import { projectService } from "../../services/projectService";
import { dasPartnerService, Partner } from "../../services/dasPartnerService";

export const InfoPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setRefresh } = useContext(RefreshContext);
    const [partner, setPartner] = useState<Partner>();

    useEffect(() => {
        console.log('venture', venture)
        if (venture) {
            dasPartnerService.getById(venture.taskGroup.partnerId)
                .then(p => {
                    console.log("partner", p);
                    setPartner(p)
                })
        }
    }, [venture])

    const saveProblem = (text: string) => {
        projectService
            .update(venture, { 'Problem (for DAS website)': text })
            .then(() => setRefresh(0))
    }

    const saveSolution = (text: string) => {
        projectService
            .update(venture, { 'Solution (for DAS website)': text })
            .then(() => setRefresh(0))
    }

    const saveImpact = (text: string) => {
        projectService
            .update(venture, { 'Impact (for DAS website)': text })
            .then(() => setRefresh(0))
    }

    const saveOverview = (text: string) => {
        dasPartnerService
            .update(partner!, { 'Overview link': text })
            .then(() => setRefresh(0))
    }

    const saveGdrive = (text: string) => {
        dasPartnerService
            .update(partner!, { 'Gdrive link URL': text })
            .then(() => setRefresh(0))
    }

    const saveHubspot = (text: string) => {
        dasPartnerService
            .update(partner!, { 'Hubspot interface': text })
            .then(() => setRefresh(0))
    }

    const saveMiro = (text: string) => {
        dasPartnerService
            .update(partner!, { 'Miro Board Link': text })
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
            <Card>
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        Venture P.S.I.
                    </Typography>
                    <Stack direction={'column'} gap={'0.5rem'}>
                        <EditBlock label="Problem" value={venture.problem} save={saveProblem} />
                        <EditBlock label="Solution" value={venture.solution} save={saveSolution} />
                        <EditBlock label="Impact" value={venture.impact} save={saveImpact} />
                    </Stack>
                </CardContent>
            </Card>
            {partner &&
                <Card>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Partner Information
                        </Typography>
                        <Stack direction={'column'} gap={'0.5rem'}>
                            <EditLink label="Overview" value={partner.overviewLink} save={saveOverview} />
                            <EditLink label="G Drive" value={partner.gdriveLink} save={saveGdrive} />
                            <EditLink label="HubSpot" value={partner.hubspotLink} save={saveHubspot} />
                            <EditLink label="Miro" value={partner.miroLink} save={saveMiro} />
                        </Stack>
                    </CardContent>
                </Card>
            }
        </Stack>
    )
};
