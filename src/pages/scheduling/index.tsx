/**
 *  scheduling/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useAuthService, useNotifications } from '@digitalaidseattle/core';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calendlyService } from './calendlyService';
import { Proctor, proctorService } from './proctorService';

const SchedulingPage = () => {
    const searchParams = useSearchParams()[0];
    const authService = useAuthService();
    const notifications = useNotifications();

    const [selectedProctor, setSelectedProctor] = useState<Proctor | null>();
    const [authCode, setAuthCode] = useState<string | null>();
    const [numLinks, setNumLinks] = useState<number>(10);
    const [activeStep, setActiveStep] = useState<number>(0);

    const redirectUri = useMemo(() => {
        // return `${window.location.origin}/api/calendly/oauth/callback`;
        return `${window.location.origin}/scheduling`;
    }, []);

    useEffect(() => {
        setAuthCode(searchParams.get('code'));
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
        setActiveStep(authCode ? 1 : 0)
    }, [authCode]);

    async function authenticate() {
        const calendlyUri = calendlyService.getAuthUri(redirectUri);
        window.location.replace(calendlyUri);
    }

    async function makeLinks() {
        if (authCode && selectedProctor) {
            try {
                const accessToken = await calendlyService.exchangeCodeForToken(authCode, redirectUri);
                const user = await calendlyService.getUser(accessToken);
                const eventTypes = await calendlyService.getEventTypes(accessToken, user.resource.uri);
                const interviewEvent = eventTypes.find(et => et.name === 'Digital Aid Seattle Interview');
                const links = await calendlyService.createOneTimeLinks(accessToken, interviewEvent!.uri, numLinks);
                const scheduled = await proctorService.addBookingLinks(selectedProctor, links);
                if (scheduled) {
                    notifications.success('Your links have been created')
                }
            } catch (err) {
                console.error(err)
                notifications.error('Your authentication with Calendly expired. Try it again.');
            }
            finally {
                setAuthCode(null)
                setActiveStep(0)
            }
        }
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={2}>
            <Typography>{selectedProctor ? selectedProctor.name : 'You are not a eligible proctor.'}</Typography>
            <Typography>Create single use links for "Digital Aid Seattle Interview" in Calendly in two step</Typography>
            {selectedProctor &&
                <>
                    <Stepper activeStep={activeStep}>
                        <Step> <StepLabel>Authenticate with Calendly</StepLabel></Step>
                        <Step> <StepLabel>Create links</StepLabel></Step>
                    </Stepper>
                    {activeStep == 0 &&
                        <Box>
                            <Button variant={'contained'} onClick={authenticate}>Authenticate</Button>
                        </Box>
                    }
                    {activeStep == 1 &&
                        <Stack direction={'row'} gap={1}>
                            <FormControl>
                                <InputLabel id="num-links-label">Choose number of links</InputLabel>

                                <Select
                                    labelId='num-links-label'
                                    sx={{ width: '200px' }}
                                    value={numLinks}
                                    label="Choose number of links<"
                                    onChange={(evt) => setNumLinks(evt.target.value as number)}>
                                    {[1, 2, 3, 5, 10].map((value: number) => <MenuItem key={`${value}`} value={value}>{value}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button variant={'contained'} onClick={makeLinks}>Do it!</Button>
                        </Stack>
                    }
                </>
            }
        </Box>
    );
}

export default SchedulingPage;