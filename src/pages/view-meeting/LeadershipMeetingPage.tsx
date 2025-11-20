import {
    Card,
    CardContent, CardHeader,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import { RefreshContext } from "@digitalaidseattle/core";
import ImHereButton from "../../components/ImHereButton";
import { Meeting, MeetingAttendee, meetingService } from "../../services/dasMeetingService";
import { Team, teamService } from "../../services/dasTeamService";
import { AttendeesCard } from "./AttendeesCard";
import { ForecastsCard } from "./ForecastsCard";
import { MeetingToolbar } from "./MeetingToolbar";
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


    return (meeting &&
        <SelectedAttendeeContext.Provider value={{ selectedAttendee, setSelectedAttendee }}>
            <Card>
                <CardHeader
                    sx={{ backgroundColor: CARD_HEADER_SX }}
                    title={<Typography variant="h2">{meeting.name} : {dayjs(meeting.start_date).format('MM/DD/YYYY')}</Typography>}
                    action={<ImHereButton
                        meeting={meeting}
                        onChange={() => refreshMeeting()} />}
                >
                </CardHeader>
                <CardContent>
                    <Grid container spacing={2} >
                        <Grid size={12}>
                            <Card>
                                <MeetingToolbar entity={meeting} onChange={() => refreshMeeting()} />
                            </Card>
                        </Grid>
                        <Grid size={3}>
                            <AttendeesCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Grid>
                        <Grid size={5}>
                            <Stack gap={2}>
                                <TopicsCard entity={meeting} onChange={() => refreshMeeting()} />
                                <ForecastsCard entity={team!} onChange={(_evt: any) => refreshMeeting()} />
                            </Stack>
                        </Grid>
                        <Grid size={4}>
                            <NotesCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Grid>
                    </Grid >
                </CardContent>
            </Card>
        </SelectedAttendeeContext.Provider>
    );
};

export default LeadershipMeetingPage;