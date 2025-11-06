/**
 *  scheduling/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useAuthService, useNotifications } from '@digitalaidseattle/core';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calendlyService, EventType } from './calendlyService';
import { Proctor, proctorService } from './proctorService';

const DEFAULT_LINK_COUNT = 10
export const SchedulingWidget = () => {
    const [searchParams] = useSearchParams();
    const authService = useAuthService();
    const notifications = useNotifications();

    const [selectedProctor, setSelectedProctor] = useState<Proctor | null>();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [numLinks, setNumLinks] = useState<number>(DEFAULT_LINK_COUNT);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [events, setEvents] = useState<EventType[]>([]);
    const [interviewEventUri, setInterviewEventUri] = useState<string | null>(null);
    const [thinking, setThinking] = useState<boolean>(false);

    const proctorLoadedRef = useRef(false);
    const eventsLoadedRef = useRef(false);
    const oauthProcessedRef = useRef<string | null>(null);

    // Load proctor once on mount
    useEffect(() => {
        if (proctorLoadedRef.current) return;
        proctorLoadedRef.current = true;
        authService.getUser()
            .then(user => {
                if (user) {
                    proctorService.findByEmail(user.email)
                        .then(proctor => setSelectedProctor(proctor));
                }
            });
    }, [authService]);

    // Handle OAuth callback once - process code and clean URL
    useEffect(() => {
        const authCode = searchParams.get('code');
        if (authCode && oauthProcessedRef.current !== authCode && !accessToken) {
            oauthProcessedRef.current = authCode;
            calendlyService.exchangeCodeForToken(authCode, window.location.origin)
                .then(token => {
                    setAccessToken(token);
                    // Remove code from URL to prevent re-processing on reload
                    const url = new URL(window.location.href);
                    url.searchParams.delete('code');
                    window.history.replaceState({}, '', url.toString());
                })
                .catch(() => {
                    notifications.error('Failed to authenticate with Calendly. Please try again.');
                    oauthProcessedRef.current = null;
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update step and load events once when both are ready
    useEffect(() => {
        setActiveStep(accessToken ? 1 : 0);
        if (accessToken && selectedProctor && !eventsLoadedRef.current) {
            eventsLoadedRef.current = true;
            calendlyService.getUser(accessToken)
                .then(user => calendlyService.getEventTypes(accessToken, user.resource.uri))
                .then(events => {
                    setEvents(events);
                    setInterviewEventUri(events.length > 0 ? events[0].uri : null);
                })
                .catch(() => {
                    notifications.error('Your authentication with Calendly expired. Try it again.');
                    setAccessToken(null);
                    eventsLoadedRef.current = false;
                });
        }
    }, [accessToken, selectedProctor, notifications]);

    async function authenticate() {
        const calendlyUri = calendlyService.getAuthUri(window.location.origin);
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
                notifications.error('Failed to create booking links. Please try again.');
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
                                    label="Choose number of links"
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