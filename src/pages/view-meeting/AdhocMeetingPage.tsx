import {
    Card,
    CardContent, CardHeader,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Meeting, meetingService } from "../../services/dasMeetingService";


import { RefreshContext } from "@digitalaidseattle/core";
import dayjs from "dayjs";
import { useParams } from "react-router";
import ImHereButton from "../../components/ImHereButton";
import { AttendeesCard } from "./AttendeesCard";
import { NotesCard } from "./NotesCard";
import { TopicsCard } from "./TopicsCard";
import { NextMeetingCard } from "./NextMeetingCard";
import { CARD_HEADER_SX } from "./utils";

const AdhoceetingPage = () => {
    const [meeting, setMeeting] = useState<Meeting>();
    const { id } = useParams<string>();
    const { refresh } = useContext(RefreshContext);

    useEffect(() => {
        refreshMeeting();
    }, [id, refresh]);

    function refreshMeeting() {
        if (id) {
            meetingService.getById(id)
                .then(meeting => setMeeting(meeting!));
        }
    }

    return (meeting &&
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
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Stack gap={2}>
                            <AttendeesCard entity={meeting} onChange={() => refreshMeeting()} />
                            <NextMeetingCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Stack>
                    </Grid>
                    <Grid item xs={5}>
                        <Stack gap={2}>
                            <TopicsCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Stack>
                    </Grid>
                    <Grid item xs={4}>
                        <NotesCard entity={meeting} onChange={() => refreshMeeting()} />
                    </Grid>
                </Grid >
            </CardContent>
        </Card>
    );
};

export default AdhoceetingPage;