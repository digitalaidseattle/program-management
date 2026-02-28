/**
 *  scheduling/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { LoadingContext, useAuthService, useNotifications } from '@digitalaidseattle/core';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calendlyService, EventType } from './calendlyService';
import { Proctor, proctorService } from './proctorService';
import { SchedulingLink, SchedulingLinkService } from './schedulingLinkService';

const DEFAULT_LINK_COUNT = 10
export const SchedulingWidget = () => {
    const schedulingLinkService = SchedulingLinkService.newInstance();
    const [searchParams] = useSearchParams();
    const authService = useAuthService();
    const notifications = useNotifications();

    const [selectedProctor, setSelectedProctor] = useState<Proctor | null>();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [numLinks, setNumLinks] = useState<number>(DEFAULT_LINK_COUNT);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [events, setEvents] = useState<EventType[]>([]);
    const [interviewEventUri, setInterviewEventUri] = useState<string | null>(null);
    const { loading, setLoading } = useContext(LoadingContext);
    const [availableLinks, setAvailableLinks] = useState<SchedulingLink[]>([]);


    // Load proctor once on mount using authenticated user's email
    useEffect(() => {
        authService.getUser()
            .then(user => {
                if (user) {
                    proctorService.findByEmail(user.email)
                        .then(proctor => setSelectedProctor(proctor));
                }
            });
    }, [authService]);

    useEffect(() => {
        const authCode = searchParams.get('code');
        if (authCode && !accessToken) {
            calendlyService.exchangeCodeForToken(authCode, window.location.origin)
                .then(token => {
                    setAccessToken(token);
                    // Remove code from URL to prevent re-processing on reload
                    const url = new URL(window.location.href);
                    url.searchParams.delete('code');
                    console.log('replace', url);
                    window.history.replaceState({}, '', url.toString());
                })
                .catch((error) => {
                    notifications.error('Failed to authenticate with Calendly. Please try again.');
                    console.error('Scheduling widget - ', error);
                });
        }
    }, [searchParams]);

    // Update step and load events once when both are ready
    useEffect(() => {
        fetchData();
    }, [selectedProctor]);

    // Update step and load events once when both are ready
    useEffect(() => {
        setActiveStep(accessToken ? 1 : 0);
        if (accessToken) {
            fetchEvents(accessToken);
        }
    }, [accessToken]);

    async function fetchData() {
        if (selectedProctor) {
            setLoading(true);
            schedulingLinkService.findByName(selectedProctor.name)
                .then(links => setAvailableLinks(links.filter(link => link.status === SchedulingLinkService.AVAILABLE_STATUS)))
                .finally(() => setLoading(false));
        }
    }

    async function fetchEvents(accessToken: string) {
        console.log('fetchEvents', accessToken);
        calendlyService.getUser(accessToken)
            .then(user => calendlyService.getEventTypes(accessToken, user.resource.uri)
                .then(events => {
                    setEvents(events);
                    setInterviewEventUri(events.length > 0 ? events[0].uri : null);
                })
                .catch((error) => {
                    console.log('Failed to get EventTypes', error)
                    notifications.error('Your authentication with Calendly expired. Try it again.');
                    setAccessToken(null);
                }))
            .catch((error) => {
                console.log('Failed to getUser', error)
                notifications.error('Your authentication with Calendly expired. Try it again.');
                setAccessToken(null);
            })
    }

    async function authenticate() {
        setAccessToken(null);
        const calendlyUri = calendlyService.getAuthUri(window.location.origin);
        window.location.replace(calendlyUri);
    }

    async function makeLinks() {
        if (accessToken && interviewEventUri && selectedProctor) {
            try {
                setLoading(true);
                // Step 1: Create links in Calendly
                const links = await calendlyService.createOneTimeLinks(accessToken, interviewEventUri, numLinks);

                if (links.length === 0) {
                    notifications.error('No scheduling links were created. Please try again.');
                    return;
                }

                if (links.length < numLinks) {
                    notifications.warn(`Only ${links.length} out of ${numLinks} links were created.`);
                }

                // Step 2: Insert links into Coda table via API
                const schedulingLiks = links.map(link => {
                    return {
                        ...schedulingLinkService.empty(),
                        interviewer: selectedProctor.name,
                        url: link
                    }
                })
                schedulingLinkService.batchInsert(schedulingLiks)
                    .then(schedulingLinks => {
                        notifications.success(`Successfully created ${schedulingLinks.length} scheduling link${schedulingLinks.length === 1 ? '' : 's'} and added them to Coda.`);
                        fetchData();
                    })
            } catch (err) {
                console.error('Error creating booking links:', err);
                notifications.error(`Failed to create booking links: ${err instanceof Error ? err.message : 'Please try again.'}`);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
            <Typography>{selectedProctor ? selectedProctor.name : 'You are not a eligible proctor.'}</Typography>
            {selectedProctor && <Typography>{`You have ${availableLinks.length} available links.`}</Typography>}
            <Typography fontWeight={600}>Create single-use links in Calendly in two steps.</Typography>
            {selectedProctor &&
                <>
                    <Stepper activeStep={activeStep}>
                        <Step> <StepLabel>Authenticate with Calendly</StepLabel></Step>
                        <Step> <StepLabel>Create links</StepLabel></Step>
                    </Stepper>
                    {activeStep == 0 &&
                        <Stack direction={'row'} gap={1}>
                            <Button variant={'contained'} disabled={loading} onClick={authenticate}>Authenticate</Button>
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
                                    label="Choose number of links"
                                    onChange={(evt) => setNumLinks(evt.target.value as number)}>
                                    {[1, 2, 3, 5, 10].map((value: number) => <MenuItem key={`${value}`} value={value}>{value}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button variant={'contained'} onClick={makeLinks} disabled={loading}>Do it!</Button>
                            {loading && <CircularProgress color="secondary" />}
                        </Stack>
                    }
                </>
            }
        </Box>
    );
}