import {
    Box,
    Button,
    Card,
    CardContent, CardHeader,
    Checkbox,
    Grid,
    Stack,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import { RefreshContext } from "@digitalaidseattle/core";
import googleMeet from "../../assets/images/icons/google-meet.png";
import ImHereButton from "../../components/ImHereButton";
import { Meeting, MeetingAttendee, meetingService } from "../../services/dasMeetingService";
import { Team, teamService } from "../../services/dasTeamService";
import { AttendeesCard } from "./AttendeesCard";
import { ForecastsCard } from "./ForecastsCard";
import { NotesCard } from "./NotesCard";
import { SelectedAttendeeContext } from "./SelectedAttendeeContext";
import { TopicsCard } from "./TopicsCard";
import { CARD_HEADER_SX } from "./utils";

const LeadershipMeetingPage = () => {
    const [meeting, setMeeting] = useState<Meeting>();
    const { id } = useParams<string>();
    const { refresh } = useContext(RefreshContext);
    const [selectedAttendee, setSelectedAttendee] = useState<MeetingAttendee>();
    const [team, setTeam] = useState<Team>();

    useEffect(() => {
        refreshMeeting();
    }, [id, refresh]);

    useEffect(() => {
        // handle refresh when an attendee is selected
        if (selectedAttendee && meeting) {
            const attendee = meeting.meeting_attendee?.find(a => a.id === selectedAttendee.id);
            if (attendee) {
                teamService.getById(attendee.team_id!)
                    .then(team => setTeam(team!));
            } else {
                setSelectedAttendee(undefined);
                setTeam(undefined);
            }
        }
    }, [meeting]);

    useEffect(() => {
        if (selectedAttendee) {
            teamService.getById(selectedAttendee.team_id!)
                .then(team => setTeam(team!));
        }
    }, [selectedAttendee]);

    function refreshMeeting() {
        meetingService.getCurrent('leadership')
            .then(meeting => setMeeting(meeting));
    }

    function handleStatusChange(newStatus: 'new' | 'concluded' | undefined): void {
        if (meeting) {
            meetingService.update(meeting?.id, { status: newStatus })
                .then(() => refreshMeeting());
        }
    }

    function handleOpenMeet(): void {
        if (meeting) {
            window.open(meeting.meeting_url, '_blank', 'rel=noopener noreferrer')
        }
    }

    return (meeting &&
        <SelectedAttendeeContext.Provider value={{ selectedAttendee, setSelectedAttendee }}>
            <Card>
                <CardHeader
                    sx={{ backgroundColor: CARD_HEADER_SX }}
                    title={<Typography variant="h2">{meeting.name} : {dayjs(meeting.date).format('MM/DD/YYYY')}</Typography>}
                    action={<ImHereButton
                        meeting={meeting}
                        onChange={() => refreshMeeting()} />}
                >
                </CardHeader>
                <CardContent>
                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <Card>
                                <Toolbar sx={{ gap: 2 }}>
                                    <Tooltip title={`Open Google meeing, ${meeting.meeting_url}, in a new window.`}>
                                        <Button variant="outlined" onClick={() => handleOpenMeet()}>
                                            <img height={26} src={googleMeet} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Create a new meeting.`}>
                                        <Button variant="outlined" onClick={() => alert('One day this will show a dialog to clone this meeting.')}>New</Button>
                                    </Tooltip>
                                    <Box style={{ flexGrow: 1 }} />
                                    <Box><Checkbox value={meeting.status === 'concluded'}
                                        disabled={meeting.status === 'concluded'}
                                        onClick={() => handleStatusChange('concluded')} />Concluded</Box>
                                </Toolbar>
                            </Card>
                        </Grid>
                        <Grid item xs={3}>
                            <AttendeesCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Grid>
                        <Grid item xs={5}>
                            <Stack gap={2}>
                                <TopicsCard entity={meeting} onChange={() => refreshMeeting()} />
                                <ForecastsCard entity={team!} onChange={(_evt: any) => refreshMeeting()} />
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <NotesCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Grid>
                    </Grid >
                </CardContent>
            </Card>
        </SelectedAttendeeContext.Provider>
    );
};

export default LeadershipMeetingPage;