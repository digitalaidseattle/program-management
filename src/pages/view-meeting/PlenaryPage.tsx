import {
    Avatar,
    Card,
    CardContent, CardHeader,
    CardMedia,
    Checkbox,
    Grid,
    Stack,
    SxProps,
    Table, TableBody, TableCell,
    TableHead, TableRow,
    Typography
} from "@mui/material";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Meeting, MeetingAttendee, meetingService, MeetingTopic, meetingTopicService } from "../../services/dasMeetingService";

import { EntityProps } from "../../components/utils";
import { Volunteer, volunteerService } from "../../services/dasVolunteerService";

import { RefreshContext, useStorageService } from "@digitalaidseattle/core";
import { DrawerOpenContext, useLayoutConfiguration } from "@digitalaidseattle/mui";
import dayjs from "dayjs";
import CollapsibleCard from "../../components/CollasibleCard";
import ImHereButton from "../../components/ImHereButton";
import { ScrollList } from "../../components/ScrollList";
import { MeetingToolbar } from "./MeetingToolbar";

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #ce80e8ff -11.18%, #e5d9e5ff 111.48%)" };

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
        <Card sx={{  width: 200, maxHeight: 400 }} >
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
        <CollapsibleCard title={title} headerSx={CARD_HEADER_SX}>
            <CardContent sx={{ paddingTop: 0 }}>
                <ScrollList
                    items={topics}
                    listItemRenderer={(entity) => <VolunteerTopicCard entity={entity} onChange={onChange} />}
                    direction="row" />
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
        <CollapsibleCard title='Shout Outs' headerSx={CARD_HEADER_SX}>
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
        <CollapsibleCard title='Topics' headerSx={CARD_HEADER_SX}>
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={'50px'}></TableCell>
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

function AttendeesCard({ meeting }: { meeting: Meeting, sx?: SxProps, onChange: (updated: any) => void }) {
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
    const storageService = useStorageService()!;

    useEffect(() => {
        if (meeting) {
            const present = (meeting.meeting_attendee ?? [])
                .filter(ma => ma.status === 'present');
            setAttendees(present)
        }
    }, [meeting])

    function listItemRenderer(attendee: MeetingAttendee): ReactNode {
        return (
            <Card key={attendee.id}
                sx={{
                    width: "100%",
                    boxShadow: 'none'
                }}>
                <CardHeader
                    title={attendee.profile!.name}
                    avatar={<Avatar
                        src={storageService.getUrl(`profiles/${attendee.profile!.id}`)}
                        alt={`${attendee.profile!.name} picture`}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                        variant="rounded" />} />
            </Card>
        )
    }

    return (
        <Card sx={{ height: 'calc(100vh - 200px)' }}>
            <CardHeader title="Attendees"
                sx={CARD_HEADER_SX} />
            <ScrollList
                items={attendees}
                listItemRenderer={listItemRenderer} />
        </Card>
    )
}

const PlenaryPage = () => {
    const [iceBreaker, setIceBreaker] = useState<string>('');
    const [meeting, setMeeting] = useState<Meeting>();

    // The carousel is forcing monitoring of drawer state to adjust width
    const { drawerOpen } = useContext(DrawerOpenContext)
    const layout = useLayoutConfiguration();
    const [width, setWidth] = useState<string>();
    const { refresh } = useContext(RefreshContext)

    useEffect(() => {
        if (drawerOpen) {
            setWidth(`calc(100% - ${layout.configuration.drawerWidth}px)`)
        } else {
            setWidth('100%')
        }
    }, [layout, drawerOpen]);

    useEffect(() => {
        refreshMeeting();
    }, [refresh]);

    useEffect(() => {
        if (meeting) {
            const ice = (meeting.meeting_topic ?? []).find(t => t.type === 'icebreaker');
            setIceBreaker(ice ? ice.message : '')
        }
    }, [meeting])

    function refreshMeeting() {
        meetingService.getCurrent('plenary')
            .then(plenary => setMeeting(plenary));
    }

    return (meeting &&
        <Card sx={{ margin: 0, width: { width } }}>
            <CardHeader
                sx={CARD_HEADER_SX}
                title={<Typography variant="h2">{meeting.name} : {dayjs(meeting.start_date).format('MM/DD/YYYY')}</Typography>}
                action={<ImHereButton
                    meeting={meeting}
                    onChange={() => refreshMeeting()} />}
            />
            <CardContent sx={{ padding: 1 }}>
                <Grid container spacing={1} >
                    <Grid item xs={12}>
                        <MeetingToolbar entity={meeting} onChange={() => refreshMeeting()} />
                    </Grid>
                    <Grid item xs={3}>
                        <AttendeesCard meeting={meeting} onChange={() => refreshMeeting()} />
                    </Grid>
                    <Grid item xs={9}>
                        <Stack gap={1} >
                            <CollapsibleCard title='Ice Breaker' headerSx={CARD_HEADER_SX}>
                                <CardContent>{iceBreaker}</CardContent>
                            </CollapsibleCard>
                            <VolunteersCarouselCard
                                title="Introductions"
                                topics={(meeting.meeting_topic ?? [])
                                    .filter(t => t.type === 'intro' && !t.discussed)}
                                onChange={() => refreshMeeting()} />
                            <VolunteersCarouselCard
                                title="Annversaries"
                                topics={(meeting.meeting_topic ?? [])
                                    .filter(t => t.type === 'anniversary' && !t.discussed)}
                                onChange={() => refreshMeeting()} />
                            <ShoutoutsCard entity={meeting} onChange={() => refreshMeeting()} />
                            <TeamCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Stack>
                    </Grid>
                </Grid >
            </CardContent>
        </Card>
    );
};

export default PlenaryPage;