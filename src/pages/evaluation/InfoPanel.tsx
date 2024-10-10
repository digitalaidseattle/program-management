
/**
 *  InfoPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { EditOutlined } from "@ant-design/icons";
import { Card, CardContent, Chip, FormLabel, IconButton, Link, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { RefreshContext } from "../../components/contexts/RefreshContext";
import { EditBlock, EditLink } from "../../components/EditBlock";
import { dasPartnerService, Partner } from "../../services/dasPartnerService";
import { TaskGroup } from "../../services/dasTaskGroupService";
import { VentureProps } from "../../services/dasVentureService";
import { projectService } from "../../services/projectService";
import useVolunteers from "../../services/useVolunteers";
import TaskGroupDialog from "./taskGroupDialog";
import { Volunteer } from "../../services/dasVolunteerService";

export const TaskGroupDetailsSection = (props: { taskGroup: TaskGroup }) => {
    const volunteers = useVolunteers();
    const [responsibleVolunteers, setResponsibleVolunteers] = useState<Volunteer[]>([]);
    const [projectManagers, setProjectManagers] = useState<Volunteer[]>([]);
    const [productManagers, setProductManagers] = useState<Volunteer[]>([]);
    const [contributorProductManagers, setContributorProductManagers] = useState<Volunteer[]>([]);
    
    const [initialized, setInitialized] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const { setRefresh } = useContext(RefreshContext);

    useEffect(() => {
        if (!initialized) {
            if (volunteers.status === 'fetched' && props.taskGroup) {
                setResponsibleVolunteers(volunteers.data.filter(v => props.taskGroup.responsibleIds.includes(v.id)))
                setProjectManagers(volunteers.data.filter(v => props.taskGroup.ventureProjectManagerIds.includes(v.id)))
                setProductManagers(volunteers.data.filter(v => props.taskGroup.ventureProductManagerIds.includes(v.id)))
                setContributorProductManagers(volunteers.data.filter(v => props.taskGroup.contributorPdMIds.includes(v.id)))
                setInitialized(true)
            }
        }
    }, [volunteers, props])

    return (
        <>
            <Card>
                <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        Task Group Details
                        <IconButton size="small" color="primary" onClick={() => setShowDialog(true)}>
                            <EditOutlined />
                        </IconButton>
                    </Typography>
                    <Stack direction={'column'} gap={'0.5rem'}>
                        <Stack direction={'row'} gap={'0.5rem'} sx={{ justifyContent: 'space-between' }}>
                            <Stack direction={'column'} gap={'0.5rem'}><FormLabel>Name:</FormLabel><Typography>{props.taskGroup.name}</Typography></Stack>
                            <Stack direction={'column'} gap={'0.5rem'}><FormLabel>Priority:</FormLabel><Chip label={props.taskGroup.priority} color="primary" variant="filled" /></Stack>
                            <Stack direction={'column'} gap={'0.5rem'}><FormLabel>Status:</FormLabel><Chip label={props.taskGroup.status} color="warning" /></Stack>
                        </Stack>
                        <FormLabel>Request Details:</FormLabel><Typography>{props.taskGroup.requestDetails}</Typography>
                        <FormLabel>G Drive:</FormLabel><Link href={props.taskGroup.driveUrl} >{props.taskGroup.driveUrl}</Link>
                        <FormLabel>Responsible:</FormLabel><Typography>{responsibleVolunteers.map(v => v.name).join(', ')}</Typography>
                        <FormLabel>Venture Project Manager:</FormLabel><Typography>{projectManagers.map(v => v.name).join(', ')}</Typography>
                        <FormLabel>Venture Product Manager:</FormLabel><Typography>{productManagers.map(v => v.name).join(', ')}</Typography>
                        <FormLabel>Contributor Product Manager:</FormLabel><Typography>{contributorProductManagers.map(v => v.name).join(', ')}</Typography>
                    </Stack>
                </CardContent>
            </Card>
            <TaskGroupDialog
                entity={props.taskGroup}
                open={showDialog}
                handleSuccess={() => {
                    setRefresh(0);
                    setShowDialog(false)
                }}
                handleError={e => console.error(e)}
            />
        </>
    )
}

export const InfoPanel: React.FC<VentureProps> = ({ venture }) => {
    const { setRefresh } = useContext(RefreshContext);
    const [partner, setPartner] = useState<Partner>();

    useEffect(() => {
        if (venture) {
            dasPartnerService.getById(venture.taskGroup.partnerId)
                .then(p => setPartner(p))
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
                <Typography fontWeight={600}>Venture Status: </Typography>
                <Typography> {venture.status}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Typography fontWeight={600}>Painpoint: </Typography>
                <Typography>{venture.painpoint}</Typography>
            </Stack>
            {venture.taskGroup &&
                <TaskGroupDetailsSection taskGroup={venture.taskGroup} />
            }
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
