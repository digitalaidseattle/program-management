import { Box, Button, Card, CardContent, CardHeader, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ListCard } from "../../components/ListCard";
import { Meeting, MeetingAttendee, meetingService, MeetingTopic } from "../../services/dasMeetingService";
import { SupabaseStorage } from "../../services/supabaseStorage";

const supabaseStorage = new SupabaseStorage();

function shuffle<T>(array: T[]): T[] {
    const result = [...array]; // make a copy (avoid mutating original)
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index
        [result[i], result[j]] = [result[j], result[i]]; // swap
    }
    return result;
}

const PlenaryPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
    const [iceBreaker, setIceBreaker] = useState<string>('');
    const [shoutOuts, setShoutOuts] = useState<MeetingTopic[]>([]);
    const [topics, setTopics] = useState<MeetingTopic[]>([]);
    const [meeting, setMeeting] = useState<Meeting>();

    useEffect(() => {
        // For testing
        meetingService.getCurrentPlenary()
            .then(plenary => setMeeting(plenary));
    }, []);

    useEffect(() => {
        console.log(meeting)
        if (meeting) {
            const ice = (meeting.meeting_topic ?? []).find(t => t.type === 'icebreaker');
            setIceBreaker(ice ? ice.description : '')
            const shouts = (meeting.meeting_topic ?? []).filter(t => t.type === 'shoutout');
            setShoutOuts(shouts);
            setAttendees(shuffle(meeting.meeting_attendee ?? []))
            const topics = (meeting.meeting_topic ?? []).filter(t => t.type === 'team');
            setTopics(topics);
        }
    }, [meeting])

    return (meeting &&
        <Stack gap={1}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center", // vertically center
                    p: 2,
                    backgroundColor: "background.paper",
                }}
            >
                <Typography variant="h2">{meeting.name}</Typography>
                <Button variant="contained">I'm here</Button>

            </Box>
            <Stack direction="row" sx={{ height: "100vh" }}>
                <Box
                    ref={containerRef}
                    sx={{
                        height: "100%",             // fill parent container height
                        overflowY: "auto",          // enable vertical scroll
                        overflowX: "hidden",        // hide horizontal scroll (optional)
                        boxSizing: "border-box",    // include padding in height calc
                    }}
                >
                    {attendees.map((attendee, idx) =>
                    (
                        <ListCard key={`${idx}`}
                            title={attendee.profile!.name}
                            avatarImageSrc={supabaseStorage.getUrl(`profiles/${attendee.profile!.id}`)} />
                    ))}
                </Box>
                <Stack
                    sx={{
                        width: '100%',
                        height: "100%",             // fill parent container height
                        overflowY: "auto",          // enable vertical scroll
                        overflowX: "hidden",        // hide horizontal scroll (optional)
                        boxSizing: "border-box",    // include padding in height calc
                        padding: 2,
                        gap: 2
                    }}>
                    <Card>
                        <CardHeader title='Ice Breaker' />
                        <CardContent>{iceBreaker}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader title='Intros' />
                    </Card>
                    <Card>
                        <CardHeader title='Anniversaries' />
                    </Card>
                    <Card>
                        <CardHeader title='Shout Outs' />
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={'20%'}>Who</TableCell>
                                        <TableCell>Why</TableCell>
                                        <TableCell width={'20%'}>From</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shoutOuts.map((so, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell width={'20%'}>{so.title}</TableCell>
                                            <TableCell >{so.description}</TableCell>
                                            <TableCell width={'20%'}>{so.created_by}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader title='Topics' />
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={'75%'}>Description</TableCell>
                                        <TableCell width={'25%'}>From</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topics.map((topic, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{topic.title}</TableCell>
                                            <TableCell>{topic.created_by}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Stack>

            </Stack >
        </Stack>
    );
};

export default PlenaryPage;