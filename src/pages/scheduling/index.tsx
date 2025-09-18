/**
 *  scheduling/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useAuthService, useNotifications } from '@digitalaidseattle/core';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calendlyService, EventType } from './calendlyService';
import { Proctor, proctorService } from './proctorService';

const DEFAULT_LINK_COUNT = 10
const SchedulingPage = () => {
    const searchParams = useSearchParams()[0];
    const authService = useAuthService();
    const notifications = useNotifications();

    const [selectedProctor, setSelectedProctor] = useState<Proctor | null>();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [numLinks, setNumLinks] = useState<number>(DEFAULT_LINK_COUNT);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [events, setEvents] = useState<EventType[]>([]);
    const [interviewEventUri, setInterviewEventUri] = useState<string | null>(null);
    const [thinking, setThinking] = useState<boolean>(false);

    const redirectUri = useMemo(() => {
        // return `${window.location.origin}/api/calendly/oauth/callback`;
        return `${window.location.origin}/scheduling`;
    }, []);

    useEffect(() => {
        const authCode = searchParams.get('code');
        if (authCode) {
            calendlyService.exchangeCodeForToken(authCode, redirectUri)
                .then(accessToken => setAccessToken(accessToken))
        }
        authService.getUser()
            .then(user => {
                if (user) {
                    proctorService
                        .findByEmail(user.email)
                        .then(proctor => setSelectedProctor(proctor))
                }
            })
    }, []);

    useEffect(() => {
        setActiveStep(accessToken ? 1 : 0)
        if (accessToken && selectedProctor) {
            try {
                calendlyService.getUser(accessToken)
                    .then(user => {
                        calendlyService.getEventTypes(accessToken, user.resource.uri)
                            .then(events => {
                                console.log(events)
                                setEvents(events)
                                setInterviewEventUri(events.length > 0 ? events[0].uri : null)
                            })
                    })
            } catch (err) {
                console.error(err)
                notifications.error('Your authentication with Calendly expired. Try it again.');
                setAccessToken(null);
            }
        }
    }, [accessToken, selectedProctor]);

    async function authenticate() {
        const calendlyUri = calendlyService.getAuthUri(redirectUri);
        window.location.replace(calendlyUri);
    }

    async function makeLinks() {
        if (accessToken && interviewEventUri && selectedProctor) {
            try {
                setThinking(true);
                const links = await calendlyService.createOneTimeLinks(accessToken, interviewEventUri, numLinks);
                const scheduled = await proctorService.addBookingLinks(selectedProctor, links);
                if (scheduled) {
                    notifications.success('Your links have been created.')
                }
            } catch (err) {
                console.error(err);
                notifications.error('Your authentication with Calendly expired. Try it again.');
            } finally {
                setThinking(false);
            }
        }
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={2}>
            <Typography>{selectedProctor ? selectedProctor.name : 'You are not a eligible proctor.'}</Typography>
            <Typography fontWeight={600}>Create single-use links in Calendly in two steps.</Typography>
            {selectedProctor &&
                <>
                    <Stepper activeStep={activeStep}>
                        <Step> <StepLabel>Authenticate with Calendly</StepLabel></Step>
                        <Step> <StepLabel>Create links</StepLabel></Step>
                    </Stepper>
                    {activeStep == 0 &&
                        <Stack direction={'row'} gap={1}>
                            <Button variant={'contained'} onClick={authenticate}>Authenticate</Button>
                        </Stack>
                    }
                    {activeStep == 1 &&
                        <Stack direction={'row'} gap={1}>
                            <FormControl>
                                <InputLabel id="num-links-label">Choose Calendly event</InputLabel>
                                <Select
                                    labelId='num-links-label'
                                    sx={{ width: '300px' }}
                                    value={interviewEventUri ?? ''}
                                    label="Choose Calendly event"
                                    onChange={(evt) => setInterviewEventUri(evt.target.value)}>
                                    {events.map((event: EventType) => <MenuItem key={`${event.id}`} value={event.uri}>{event.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="num-links-label">Choose number of links</InputLabel>
                                <Select
                                    labelId='num-links-label'
                                    sx={{ width: '150px' }}
                                    value={numLinks}
                                    label="Choose number of links<"
                                    onChange={(evt) => setNumLinks(evt.target.value as number)}>
                                    {[1, 2, 3, 5, 10].map((value: number) => <MenuItem key={`${value}`} value={value}>{value}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button variant={'contained'} onClick={makeLinks} disabled={thinking}>Do it!</Button>
                            {thinking && <CircularProgress color="secondary" />}
                        </Stack>
                    }
                </>
            }
        </Box>
    );
}

export default SchedulingPage;