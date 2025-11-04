import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent, CardHeader,
    Checkbox,
    Grid,
    IconButton,
    Stack,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Meeting, MeetingAttendee, meetingService, MeetingTopic, meetingTopicService } from "../../services/dasMeetingService";

import { EntityProps } from "../../components/utils";

import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useStorageService } from "@digitalaidseattle/core";
import dayjs from "dayjs";
import { useParams } from "react-router";
import ImHereButton from "../../components/ImHereButton";


export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #44d054ff 111.48%, #b6e3c2ff -11.18%)" };

function TopicsCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [topics, setTopics] = useState<MeetingTopic[]>([]);

    useEffect(() => {
        if (meeting) {
            setTopics(meeting.meeting_topic!);
        }
    }, [meeting]);

    function markAsDiscussed(topic: MeetingTopic) {
        meetingTopicService.update(topic.id!, { discussed: true })
            .then((updated) => onChange(updated))
    }

    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Topics'} />
            <CardContent>
                <Table>
                    <TableBody>
                        {topics.map((topic, idx) => (
                            <TableRow key={idx}>
                                <TableCell><Checkbox checked={topic.discussed}
                                    onClick={() => markAsDiscussed(topic)} /></TableCell>
                                <TableCell>{topic.source}</TableCell>
                                <TableCell>{topic.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>)
}

function OKRsCard({ entity: meeting }: EntityProps<Meeting>) {
    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'OKRs'} />
            <CardContent>
                <Typography>OKRs go here</Typography>
            </CardContent>
        </Card>)
}

function ForecastsCard({ entity: meeting}: EntityProps<Meeting>) {
    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Forecasts'} />
            <CardContent>
                <Typography>Forecasts go here</Typography>
            </CardContent>
        </Card>)
}

function NotesCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [notes, setNotes] = useState<string>();
    const [pristine, setPristine] = useState<boolean>(true);

    useEffect(() => {
        if (meeting) {
            setNotes(meeting.notes);
            setPristine(true);
        }
    }, [meeting]);

    function save(): void {
        meetingService.update(meeting.id, { notes: notes })
            .then(updated => {
                onChange(updated)
            })
    }

    function handleChange(text: string): void {
        if (text !== notes) {
            setPristine(false);
            setNotes(text)
        }
    }
    return (
        <Card>
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Notes'} />
            <CardContent>
                <TextField
                    value={notes}
                    sx={{
                        width: "100%",
                        '& .MuiInputBase-inputMultiline': { // Target the multiline input element
                            resize: 'both', // Allows both horizontal and vertical resizing
                            overflow: 'auto', // Ensures scrollbars appear if content exceeds visible area
                        }
                    }}
                    multiline={true}
                    rows={8}
                    onChange={(evt) => handleChange(evt.target.value)}
                />
            </CardContent>
            <CardActions>
                <Button disabled={pristine} onClick={() => save()}>Save</Button>
            </CardActions>
        </Card>
    )
}

function AttendeesCard({ entity: meeting }: { entity: Meeting, sx?: SxProps, onChange: (updated: any) => void }) {
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
    const storageService = useStorageService()!;

    useEffect(() => {
        if (meeting) {
            setAttendees(meeting.meeting_attendee!)
        }
    }, [meeting])

    return (
        <Card>
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title="Attendees" />
            <Box
                sx={{
                    height: "100%",             // fill parent container height
                    overflowY: "auto",          // enable vertical scroll
                    overflowX: "hidden",        // hide horizontal scroll (optional)
                    boxSizing: "border-box",    // include padding in height calc
                }}
            >
                {attendees.map((attendee, idx) =>
                (<Card
                    key={idx}
                    sx={{
                        width: "100%",
                        boxShadow: 'none'
                    }}
                >
                    <CardHeader
                        title={attendee.profile!.name}
                        avatar={<Avatar
                            src={storageService.getUrl(`profiles/${attendee.profile!.id}`)}
                            alt={`${attendee.profile!.name} picture`}
                            sx={{ width: 40, height: 40, objectFit: 'contain' }}
                            variant="rounded" />}
                        action={
                            <IconButton aria-label="more button" disabled={true} >
                                {attendee.status === 'present' ? <CheckCircleOutlined /> : attendee.status === 'absent' ? <CloseCircleOutlined /> : <QuestionCircleOutlined />}
                            </IconButton>}
                    />
                </Card >)
                )}
            </Box>
        </Card>
    )
}

function NextMeetingCard({ entity: meeting }: EntityProps<Meeting>) {
    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Next Meeting'} />
            <CardContent>
                <Typography>Next Meeting widget goes here</Typography>
            </CardContent>
        </Card>)
}


const TeamMeetingPage = () => {
    const [meeting, setMeeting] = useState<Meeting>();
    const { id } = useParams<string>();

    useEffect(() => {
        refresh();
    }, [id]);


    function refresh() {
        if (id) {
            meetingService.getById(id)
                .then(meeting => setMeeting(meeting!));
        }
    }

    return (meeting &&
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center", // vertically center
                        p: 2,
                        backgroundColor: "background.paper",
                    }}
                >
                    <Typography variant="h2">{meeting.name} : {dayjs(meeting.date).format('MM/DD/YYYY')}</Typography>
                    <ImHereButton
                        meeting={meeting}
                        onChange={() => refresh()} />
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Stack gap={2}>
                    <AttendeesCard entity={meeting} onChange={() => refresh()} />
                    <NextMeetingCard entity={meeting} onChange={() => refresh()} />
                </Stack>
            </Grid>
            <Grid item xs={5}>
                <Stack gap={2}>
                    <TopicsCard entity={meeting} onChange={() => refresh()} />
                    <ForecastsCard entity={meeting} onChange={() => refresh()} />
                    <OKRsCard entity={meeting} onChange={() => refresh()} />
                </Stack>
            </Grid>
            <Grid item xs={4}>
                <NotesCard entity={meeting} onChange={() => refresh()} />
            </Grid>

        </Grid >
    );
};

export default TeamMeetingPage;