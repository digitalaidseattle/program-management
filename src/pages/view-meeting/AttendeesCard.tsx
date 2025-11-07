import {
    Avatar,
    Box,
    Card,
    CardHeader,
    SxProps,
    Typography,
    useTheme
} from "@mui/material";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Meeting, MeetingAttendee } from "../../services/dasMeetingService";


import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useStorageService } from "@digitalaidseattle/core";
import { Team, teamService } from "../../services/dasTeamService";
import { SelectedAttendeeContext } from "./SelectedAttendeeContext";
import { CARD_HEADER_SX } from "./utils";
import { ScrollList } from "../../components/ScrollList";


function AttendeesCard({ entity: meeting }: { entity: Meeting, sx?: SxProps, onChange: (updated: any) => void }) {
    const theme = useTheme();

    const [teams, setTeams] = useState<Team[]>([]);
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);

    const { selectedAttendee, setSelectedAttendee } = useContext(SelectedAttendeeContext);
    const storageService = useStorageService()!;

    useEffect(() => {
        //  ONly used for leadership
        teamService.getAll()
            .then(t => setTeams(t));
    }, [])

    useEffect(() => {
        if (meeting) {
            setAttendees(meeting.meeting_attendee!);
        }
    }, [meeting]);

    useEffect(() => {
        if (selectedAttendee) {
            setSelectedAttendee(attendees.find(att => att.id === selectedAttendee.id)!);
        }
    }, [attendees])

    function getTitle(attendee: MeetingAttendee): ReactNode {
        switch (meeting.type) {
            case 'leadership':
                const found = teams.find(t => t.id === attendee.team_id);
                return (
                    <Box>
                        <Typography sx={{ fontWeight: 600 }}>{found ? found.name : ''}</Typography>
                        <Typography>{attendee.profile!.name}</Typography>
                    </Box>
                );
            default:
                return attendee.profile!.name;
        }
    }

    function listItemRenderer(attendee: MeetingAttendee): ReactNode {
        return (<Card
            sx={{
                width: "100%",
                boxShadow: 'none',
                background: selectedAttendee ? attendee.id === selectedAttendee!.id ? theme.palette.grey[200] : 'none' : 'none'
            }}>
            <CardHeader
                title={getTitle(attendee)}
                avatar={<Avatar
                    src={storageService.getUrl(`profiles/${attendee.profile!.id}`)}
                    alt={`${attendee.profile!.name} picture`}
                    sx={{ width: 40, height: 40, objectFit: 'contain' }}
                    variant="rounded" />}
                action={
                    <Box sx={{ marginTop: 1.5 }}>
                        {attendee.status === 'present' && <CheckCircleOutlined style={{ color: 'green', fontSize: '20px' }} />}
                        {attendee.status === 'absent' && <CheckCircleOutlined style={{ color: 'red', fontSize: '20px' }} />}
                        {(attendee.status === null || attendee.status === 'unknown') && <QuestionCircleOutlined style={{ color: 'gray', fontSize: '20px' }} />}
                    </Box>}
            />
        </Card >)
    }

    return (
        <Card>
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title="Attendees" />
            <ScrollList
                items={attendees}
                listItemRenderer={listItemRenderer}
                selectedItem={selectedAttendee}
                onSelect={(item) => setSelectedAttendee(item)} />
        </Card>
    )
}

export { AttendeesCard };
