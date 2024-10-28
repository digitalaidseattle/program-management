
/**
 *  InfoPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { EditOutlined } from "@ant-design/icons";
import { Card, CardContent, CardMedia, Chip, FormLabel, IconButton, Link, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import placeholder from '../../assets/images/project-image.png';
import { RefreshContext } from "../../../components/contexts/RefreshContext";
import { dasPartnerService, Partner } from "../../evaluation/api/dasPartnerService";
import { EditBlock, EditLink } from "../../../components/EditBlock";
import { dasProjectService } from "../../evaluation/api/dasProjectService";
import useVolunteers from "../../evaluation/components/useVolunteers";
import { Volunteer } from "../../evaluation/api/dasVolunteerService";
import { TaskGroup } from "../../evaluation/api/dasTaskGroupService";
import TaskGroupDialog from "./taskGroupDialog";
import { VentureProps } from "../../../services/pmVentureService";

const DescriptionSection = (props: { venture: any }) => {
    return (
        <Stack direction={'row'} spacing={2}>
            <CardMedia
                component='img'
                image={props.venture.imageSrc ? props.venture.imageSrc : placeholder}
                alt={props.venture.title + " logo"}
                sx={{
                    objectFit: 'contain',
                    width: { md: '2rem', lg: '4rem' },
                    aspectRatio: '1 / 1',
                    borderRadius: '8px',
                    display: { xs: 'none', md: 'block' },
                    backgroundColor: 'white',
                }}
            />
            <Stack>
                <Stack direction="row" spacing={2}>
                    <Typography fontWeight={600}>Partner: </Typography>
                    <Typography> {props.venture.title}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Typography fontWeight={600}>Venture Status: </Typography>
                    <Typography> {props.venture.status}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Typography fontWeight={600}>Painpoint: </Typography>
                    <Typography>{props.venture.painpoint}</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}

const PartnerSection = (props: { venture: any }) => {
    const { setRefresh } = useContext(RefreshContext);
    const [partner, setPartner] = useState<Partner>();

    useEffect(() => {
        if (props.venture) {
            dasPartnerService.getById(props.venture.taskGroup.partnerId)
                .then(p => setPartner(p))
        }
    }, [props])

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
    return (partner &&
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
    )
}

const PSISection = (props: { venture: any }) => {
    const { setRefresh } = useContext(RefreshContext);
    const saveProblem = (text: string) => {
        dasProjectService
            .update(props.venture, { 'Problem (for DAS website)': text })
            .then(() => setRefresh(0))
    }

    const saveSolution = (text: string) => {
        dasProjectService
            .update(props.venture, { 'Solution (for DAS website)': text })
            .then(() => setRefresh(0))
    }

    const saveImpact = (text: string) => {
        dasProjectService
            .update(props.venture, { 'Impact (for DAS website)': text })
            .then(() => setRefresh(0))
    }
    return (
        <Card>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Venture P.S.I.
                </Typography>
                <Stack direction={'column'} gap={'0.5rem'}>
                    <EditBlock label="Problem" value={props.venture.problem} save={saveProblem} />
                    <EditBlock label="Solution" value={props.venture.solution} save={saveSolution} />
                    <EditBlock label="Impact" value={props.venture.impact} save={saveImpact} />
                </Stack>
            </CardContent>
        </Card>
    )
}

const TaskGroupDetailsSection = (props: { venture: any }) => {
    const { setRefresh } = useContext(RefreshContext);
    const volunteers = useVolunteers();
    const [responsibleVolunteers, setResponsibleVolunteers] = useState<Volunteer[]>([]);
    const [projectManagers, setProjectManagers] = useState<Volunteer[]>([]);
    const [productManagers, setProductManagers] = useState<Volunteer[]>([]);
    const [contributorProductManagers, setContributorProductManagers] = useState<Volunteer[]>([]);

    const [initialized, setInitialized] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const taskGroup: TaskGroup = props.venture.taskGroup

    useEffect(() => {
        if (!initialized) {
            if (volunteers && volunteers.status === 'fetched' && taskGroup) {
                setResponsibleVolunteers(volunteers.data.filter(v => taskGroup.responsibleIds.includes(v.id)))
                setProjectManagers(volunteers.data.filter(v => taskGroup.ventureProjectManagerIds.includes(v.id)))
                setProductManagers(volunteers.data.filter(v => taskGroup.ventureProductManagerIds.includes(v.id)))
                setContributorProductManagers(volunteers.data.filter(v => taskGroup.contributorPdMIds.includes(v.id)))
                setInitialized(true)
            }
        }
    }, [volunteers, taskGroup])

    return (taskGroup &&
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
                            <Stack direction={'column'} gap={'0.5rem'}><FormLabel>Name:</FormLabel><Typography>{taskGroup.name}</Typography></Stack>
                            <Stack direction={'column'} gap={'0.5rem'}><FormLabel>Priority:</FormLabel><Chip label={taskGroup.priority} color="primary" variant="filled" /></Stack>
                            <Stack direction={'column'} gap={'0.5rem'}><FormLabel>Status:</FormLabel><Chip label={taskGroup.status} color="warning" /></Stack>
                        </Stack>
                        <FormLabel>Request Details:</FormLabel><Typography>{taskGroup.requestDetails}</Typography>
                        <FormLabel>G Drive:</FormLabel><Link href={taskGroup.driveUrl} >{taskGroup.driveUrl}</Link>
                        <FormLabel>Responsible:</FormLabel><Typography>{responsibleVolunteers.map(v => v.name).join(', ')}</Typography>
                        <FormLabel>Venture Project Manager:</FormLabel><Typography>{projectManagers.map(v => v.name).join(', ')}</Typography>
                        <FormLabel>Venture Product Manager:</FormLabel><Typography>{productManagers.map(v => v.name).join(', ')}</Typography>
                        <FormLabel>Contributor Product Manager:</FormLabel><Typography>{contributorProductManagers.map(v => v.name).join(', ')}</Typography>
                    </Stack>
                </CardContent>
            </Card>
            <TaskGroupDialog
                entity={taskGroup}
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
    return (
        <Stack spacing={2}>
            <DescriptionSection venture={venture} />
            <TaskGroupDetailsSection venture={venture} />
            <PSISection venture={venture} />
            <PartnerSection venture={venture} />
        </Stack>
    )
};
