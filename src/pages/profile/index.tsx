/**
 *  profile/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Stack,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { storageService } from '../../App';
import { FieldRow } from '../../components/FieldRow';
import { TextEdit } from '../../components/TextEdit';
import { useVolunteer } from '../../hooks/useVolunteer';
import { profileService } from '../../services/dasProfileService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { ExternalLink } from '../../components/ExternalLink';
import { DisciplinesCard } from '../volunteer/DisplinesCard';
import { ToolsCard } from '../volunteer/ToolsCard';
import { TeamsCard } from '../volunteer/TeamsCard';

export const ProfilePage = () => {
    const { volunteer: initial } = useVolunteer();

    const [volunteer, setVolunteer] = useState<Volunteer>();

    useEffect(() => {
        setVolunteer(initial);
    }, [initial]);

    function handleVolunteerFieldChange(field: string, value: string): void {
        if (volunteer) {
            // stringify & parse needed for string keys
            const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
            volunteerService.update(volunteer.id, changes)
                .then(updated => setVolunteer(updated))
        }
    }

    function handleProfileChange(field: string, value: string): void {
        if (volunteer) {
            const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
            profileService.update(volunteer.profile!.id, changes)
                .then(() => volunteerService
                    .getById(volunteer.id)
                    .then(updatdeVolunteer => setVolunteer(updatdeVolunteer!)))
        }
    }

    return (volunteer &&
        <Card>
            <CardHeader title={`${volunteer.profile!.name}`} />
            <CardContent>
                <Grid container>
                    <Grid size={2}>
                        <Avatar
                            src={storageService.getUrl(`profiles/${volunteer.profile!.id}`)}
                            alt={`${volunteer.profile!.name} icon`}
                            sx={{
                                padding: 1,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                            variant="rounded"
                        />
                    </Grid>
                    <Grid size={10}>
                        <Stack id='asdf'>
                            <FieldRow label='Name'>
                                <TextEdit value={volunteer.profile!.name}
                                    onChange={value => handleProfileChange('name', value)} />
                            </FieldRow>
                            <FieldRow label='Position'>
                                <TextEdit value={volunteer.position}
                                    onChange={value => handleVolunteerFieldChange('position', value)} />
                            </FieldRow>
                            <FieldRow label='Status'>
                                <TextEdit value={volunteer.status}
                                    onChange={value => handleVolunteerFieldChange('position', value)} />
                            </FieldRow>
                            <FieldRow label='Join Date'>
                                <Typography>{dayjs(volunteer.join_date).format("MMM D, YYYY")}</Typography>
                            </FieldRow>
                            <FieldRow label='Location'>
                                <TextEdit value={volunteer.profile!.location}
                                    onChange={value => handleProfileChange('location', value)} />
                            </FieldRow>
                            <FieldRow label='Phone'>
                                <TextEdit value={volunteer.profile!.phone}
                                    onChange={value => handleProfileChange('phone', value)} />
                            </FieldRow>
                            <FieldRow label='Github'>
                                <TextEdit value={volunteer.github}
                                    itemRenderer={<ExternalLink
                                        requireMetaKey={true}
                                        href={`≈`}>{volunteer.github}</ExternalLink>}
                                    onChange={value => handleVolunteerFieldChange('github', value)} />
                            </FieldRow>
                            <FieldRow label='DAS email'>
                                <TextEdit value={volunteer.das_email}
                                    itemRenderer={<ExternalLink
                                        requireMetaKey={true}
                                        href={`mailto:${volunteer.das_email}`}>{volunteer.das_email}</ExternalLink>}
                                    onChange={value => handleVolunteerFieldChange('github', value)} />
                            </FieldRow>
                            <FieldRow label='Slack ID'>
                                <Typography>{volunteer.slack_id}</Typography>
                            </FieldRow>
                            <FieldRow label='Linkedin'>
                                <TextEdit value={volunteer.linkedin}
                                    itemRenderer={<ExternalLink
                                        requireMetaKey={true}
                                        href={`https://www.linkedin.com/in/${volunteer.linkedin}`}>{volunteer.linkedin}</ExternalLink>}
                                    onChange={value => handleVolunteerFieldChange('linkedin', value)} />
                            </FieldRow>
                        </Stack>
                    </Grid>
                    <Grid size={12}>
                        <TeamsCard entity={volunteer} onChange={() => { }} />
                    </Grid>
                    <Grid size={12}>
                        <DisciplinesCard entity={volunteer} onChange={() => { }} />
                    </Grid>
                    <Grid size={12}>
                        <ToolsCard entity={volunteer} onChange={() => { }} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
