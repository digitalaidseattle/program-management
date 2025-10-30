import {
    Box,
    Button,
    Card,
    CardContent, CardHeader,
    CardMedia,
    Checkbox,
    Grid,
    Stack,
    Table, TableBody, TableCell,
    TableHead, TableRow,
    Typography
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ListCard } from "../../components/ListCard";
import { Meeting, MeetingAttendee, meetingService, MeetingTopic, meetingTopicService } from "../../services/dasMeetingService";

import { EntityProps } from "../../components/utils";
import { Volunteer, volunteerService } from "../../services/dasVolunteerService";

import { useStorageService } from "@digitalaidseattle/core";
import { DrawerOpenContext, useLayoutConfiguration } from "@digitalaidseattle/mui";
import CollapsibleCard from "../../components/CollasibleCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function shuffle<T>(array: T[]): T[] {
    const result = [...array]; // make a copy (avoid mutating original)
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index
        [result[i], result[j]] = [result[j], result[i]]; // swap
    }
    return result;
}


function VolunteerTopicCard({ entity: topic, onChange }: EntityProps<MeetingTopic>) {
    const [volunteer, setVolunteer] = useState<Volunteer>();
    const storageService = useStorageService()!;

    useEffect(() => {
        if (topic && topic.subject_id && topic.subject_id.length > 0) {
            volunteerService.getById(topic.subject_id[0])
                .then(v => setVolunteer(v!));
        }
    }, [topic]);

    function markAsDiscussed() {
        meetingTopicService.update(topic.id!, { discussed: true })
            .then((updated) => onChange(updated))
    }

    return (volunteer &&
        <Card sx={{ margin: 2, width: 200, maxHeight: 400 }} >
            <CardHeader
                title={topic.subject}
                action={<Checkbox checked={topic.discussed} onClick={() => markAsDiscussed()} />} />
            <CardMedia
                component="img"
                sx={{
                    maxWidth: 250,
                    objectFit: 'fit',
                    cursor: 'pointer'
                }}
                src={storageService.getUrl(`profiles/${volunteer.profile!.id}`)}
                title={volunteer.profile!.name + ' photo'}
            />
        </Card>)
}

interface VolunteersCarouselCardProps {
    title: string;
    topics: MeetingTopic[];
    onChange: (updated: any) => void;
}
function VolunteersCarouselCard({ title, topics, onChange }: VolunteersCarouselCardProps) {
    return (
        <CollapsibleCard title={title} >
            <CardContent sx={{ paddingTop: 0 }}>
                <Carousel
                    additionalTransfrom={0}
                    arrows
                    containerClass="container"
                    infinite={false}
                    responsive={{
                        desktop: {
                            breakpoint: {
                                max: 3000,
                                min: 1024
                            },
                            items: 4,
                            partialVisibilityGutter: 40
                        },
                        mobile: {
                            breakpoint: {
                                max: 464,
                                min: 0
                            },
                            items: 1,
                            partialVisibilityGutter: 30
                        }
                    }}
                    rewind={false}
                    showDots={true}
                >
                    {topics.map((t, idx) => (
                        <VolunteerTopicCard key={idx} entity={t} onChange={onChange} />
                    ))}
                </Carousel>
            </CardContent>
        </CollapsibleCard>
    )
}

function ShoutoutsCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [topics, setTopics] = useState<MeetingTopic[]>([]);

    useEffect(() => {
        // Any setup if needed when meeting changes
        setTopics((meeting.meeting_topic ?? [])
            .filter(t => t.type === 'shoutout' && !t.discussed));
    }, [meeting]);

    function markAsDiscussed(topic: MeetingTopic) {
        meetingTopicService.update(topic.id!, { discussed: true })
            .then((updated) => onChange(updated))
    }

    return (
        <CollapsibleCard title='Shout Outs'>
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={'50px'}></TableCell>
                            <TableCell width={'30%'}>Who</TableCell>
                            <TableCell>Why</TableCell>
                            <TableCell width={'20%'}>From</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topics.map((so, idx) => (
                            <TableRow key={idx}>
                                <TableCell><Checkbox checked={so.discussed} onClick={() => markAsDiscussed(so)} /></TableCell>
                                <TableCell>{so.subject}</TableCell>
                                <TableCell>{so.message}</TableCell>
                                <TableCell>{so.source}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </CollapsibleCard>
    )
}

function TeamCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [topics, setTopics] = useState<MeetingTopic[]>([]);

    useEffect(() => {
        // Any setup if needed when meeting changes
        setTopics((meeting.meeting_topic ?? [])
            .filter(t => t.type === 'team' && !t.discussed));
    }, [meeting]);


    function markAsDiscussed(topic: MeetingTopic) {
        meetingTopicService.update(topic.id!, { discussed: true })
            .then((updated) => onChange(updated))
    }

    return (
        <CollapsibleCard title='Topics'>
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={'50%'}></TableCell>
                            <TableCell width={'25%'}>Team</TableCell>
                            <TableCell width={'75%'}>Description</TableCell>
                        </TableRow>
                    </TableHead>
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
        </CollapsibleCard>
    )
}

const PlenaryPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
    const [iceBreaker, setIceBreaker] = useState<string>('');
    const [meeting, setMeeting] = useState<Meeting>();
    const storageService = useStorageService()!;

    // The carousel is forcing monitoring of drawer state to adjust width
    const { drawerOpen } = useContext(DrawerOpenContext)
    const layout = useLayoutConfiguration();
    const [width, setWidth] = useState<string>();
    useEffect(() => {
        if (drawerOpen) {
            setWidth(`calc(100% - ${layout.configuration.drawerWidth}px)`)
        } else {
            setWidth('100%')
        }
    }, [layout, drawerOpen]);

    useEffect(() => {
        refresh();
    }, []);

    function refresh() {
        meetingService.getCurrentPlenary()
            .then(plenary => setMeeting(plenary));
    }

    useEffect(() => {
        if (meeting) {
            const ice = (meeting.meeting_topic ?? []).find(t => t.type === 'icebreaker');
            setIceBreaker(ice ? ice.message : '')
            setAttendees(shuffle(meeting.meeting_attendee ?? []))
        }
    }, [meeting])

    return (meeting &&

        <Grid container spacing={2} sx={{ width: { width } }}>
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
                    <Typography variant="h2">{meeting.name}</Typography>
                    <Button variant="contained">I'm here</Button>
                </Box>
            </Grid>
            <Grid item xs={2}>
                <Box sx={{ height: 'calc(100vh - 200px)' }}>
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
                                avatarImageSrc={storageService.getUrl(`profiles/${attendee.profile!.id}`)} />
                        ))}
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={10}>
                <Stack gap={1} >
                    <CollapsibleCard title='Ice Breaker'>
                        <CardContent>{iceBreaker}</CardContent>
                    </CollapsibleCard>
                    <VolunteersCarouselCard
                        title="Introductions"
                        topics={(meeting.meeting_topic ?? [])
                            .filter(t => t.type === 'intro' && !t.discussed)}
                        onChange={() => refresh()} />
                    <VolunteersCarouselCard
                        title="Annversaries"
                        topics={(meeting.meeting_topic ?? [])
                            .filter(t => t.type === 'anniversary' && !t.discussed)}
                        onChange={() => refresh()} />
                    <ShoutoutsCard entity={meeting} onChange={() => refresh()} />
                    <TeamCard entity={meeting} onChange={() => refresh()} />
                </Stack>
            </Grid>
        </Grid >
    );
};

export default PlenaryPage;