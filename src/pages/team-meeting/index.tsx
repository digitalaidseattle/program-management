import {
    Avatar,
    Box,
    Card,
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
import { useContext, useEffect, useState } from "react";
import { Meeting, MeetingAttendee, meetingService, MeetingTopic, meetingTopicService } from "../../services/dasMeetingService";

import { dateToString, EntityProps } from "../../components/utils";

import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { RefreshContext, useStorageService } from "@digitalaidseattle/core";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import ImHereButton from "../../components/ImHereButton";
import { Forecast, OKR, Team, teamService } from "../../services/dasTeamService";


export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }


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

    function addTopic() {
        const newTopic = meetingTopicService.empty(meeting.id);
        meetingTopicService.insert(newTopic)
            .then((updated) => onChange(updated))
    }

    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Topics'}
                action={
                    <IconButton onClick={() => addTopic()}>
                        <PlusCircleOutlined />
                    </IconButton>} />
            <CardContent sx={{ padding: 0 }}>
                <Table >
                    <TableBody>
                        {topics.map((topic, idx) => (
                            <TableRow key={idx}>
                                <TableCell width={25}><Checkbox checked={topic.discussed}
                                    onClick={() => markAsDiscussed(topic)} /></TableCell>
                                <TableCell>{topic.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>)
}

function OKRsCard({ entity: meeting }: EntityProps<Meeting>) {
    const [team, setTeam] = useState<Team>();
    const [okrs, setOkrs] = useState<OKR[]>([]);

    useEffect(() => {
        if (meeting) {
            teamService.getById(meeting.team_id)
                .then(t => setTeam(t!))
        }
    }, [meeting]);

    useEffect(() => {
        if (team) {
            setOkrs(team.okr ?? []);
        }
    }, [team]);

    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'OKRs'}
                action={<>
                    <IconButton>
                        <PlusCircleOutlined />
                    </IconButton>
                </>} />
            <CardContent sx={{ padding: 0 }}>
                <Table>
                    <TableBody>
                        {okrs.map((okr, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{dateToString(okr.start_date)}</TableCell>
                                <TableCell>{dateToString(okr.end_date)}</TableCell>
                                <TableCell>
                                    <Markdown>
                                        {okr.description}
                                    </Markdown>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function ForecastsCard({ entity: meeting }: EntityProps<Meeting>) {
    const [team, setTeam] = useState<Team>();
    const [forecasts, setForecasts] = useState<Forecast[]>([]);

    useEffect(() => {
        if (meeting) {
            teamService.getById(meeting.team_id)
                .then(t => setTeam(t!))
        }
    }, [meeting]);

    useEffect(() => {
        if (team) {
            setForecasts((team.forecast ?? [])
                .filter(f => dayjs(f.end_date).isAfter(dayjs()))
                .sort((a, b) => a.end_date.getTime() - b.end_date.getTime()))
        }
    }, [team]);
    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Forecasts'} action={
                    <IconButton>
                        <PlusCircleOutlined />
                    </IconButton>} />
            <CardContent>
                <Table>
                    <TableBody>
                        {forecasts.map((forecast, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{dateToString(forecast.start_date)}</TableCell>
                                <TableCell>{dateToString(forecast.end_date)}</TableCell>
                                <TableCell>{forecast.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>)
}

function NotesCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [notes, setNotes] = useState<string>();
    const [pristine, setPristine] = useState<boolean>(true);

    useEffect(() => {
        // allow updates only if not editing
        if (meeting && pristine) {
            setNotes(meeting.notes);
            setPristine(true);
        }
    }, [meeting]);

    function cancel(): void {
        setNotes(meeting.notes);
        setPristine(true);
    }

    function save(): void {
        meetingService.update(meeting.id, { notes: notes })
            .then(updated => {
                setPristine(true);
                onChange(updated);
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
                title={'Notes'}
                action={!pristine && <>
                    <IconButton disabled={pristine} color="error" onClick={() => cancel()}><CloseCircleOutlined /></IconButton>
                    <IconButton disabled={pristine} color="success" onClick={() => save()}><CheckCircleOutlined /></IconButton>
                </>} />
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
        </Card>
    )
}

function AttendeesCard({ entity: meeting }: { entity: Meeting, sx?: SxProps, onChange: (updated: any) => void }) {
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
    const storageService = useStorageService()!;

    useEffect(() => {
        if (meeting) {
            console.log(meeting.meeting_attendee)
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
                            <Box sx={{ marginTop: 1.5}}>
                                {attendee.status === 'present' && <CheckCircleOutlined style={{ color: 'green', fontSize: '20px' }} />}
                                {attendee.status === 'absent' && <CheckCircleOutlined style={{ color: 'red', fontSize: '20px' }} />}
                                {(attendee.status === null || attendee.status === 'unknown') && <QuestionCircleOutlined style={{ color: 'gray', fontSize: '20px' }} />}
                            </Box>}
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
                            <ForecastsCard entity={meeting} onChange={() => refreshMeeting()} />
                            <OKRsCard entity={meeting} onChange={() => refreshMeeting()} />
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

export default TeamMeetingPage;