/**
 *  AllMeetings.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import {
    Box,
    Card,
    CardContent, CardHeader,
    Grid,
    List,
    ListItem,
    MenuItem,
    Select,
    Stack,
    useTheme
} from "@mui/material";
import {
    PickersDay, pickersDayClasses,
    PickersDayProps
} from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from "dayjs";
import { ReactNode, useContext, useEffect, useState } from "react";

import { RefreshContext, useAuthService } from "@digitalaidseattle/core";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { Meeting, meetingAttendeeService, meetingService } from "../../services/dasMeetingService";
import { Team, teamService } from "../../services/dasTeamService";
import { volunteerService } from "../../services/dasVolunteerService";
import { AdhocMeetingDetails } from "./AdhocMeetingPage";
import { LeadershipMeetingDetails } from "./LeadershipMeetingPage";
import { PlenaryDetails } from "./PlenaryPage";
import { TeamMeetingDetails } from "./TeamMeetingPage";

const AllMeetingsPage = () => {
    const theme = useTheme();
    const authService = useAuthService();
    const [profileId, setProfileId] = useState<string>();
    const [teams, setTeams] = useState<Team[]>([]);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [meetingType, setMeetingType] = useState<string>("my");
    const [teamId, setTeamId] = useState<string>("all");
    const [month, setMonth] = useState<Date>(new Date());
    const [detailComponent, setDetailComponent] = useState<ReactNode>();

    const { refresh } = useContext(RefreshContext);

    useEffect(() => {
        if (authService) {
            authService
                .getUser()
                .then(user => {
                    if (user) {
                        volunteerService
                            .findByDasEmail(user.email)
                            .then(volunteer => setProfileId(volunteer ? volunteer.profile_id : undefined))
                    }
                })
        }
    }, [authService]);

    useEffect(() => {
        refreshMeeting();
        refreshTeams();
    }, [month, meetingType, teamId, refresh, profileId]);

    useEffect(() => {
        refreshMeeting();
        refreshTeams();
    }, [month, meetingType, teamId, refresh, profileId]);

    function handleMeetingChange(meeting: Meeting) {
        console.log(meeting)
        if (meeting) {
            switch (meeting.type) {
                case 'plenary':
                    setDetailComponent(<PlenaryDetails meeting={meeting} />)
                    return;
                case 'team':
                    setDetailComponent(<TeamMeetingDetails meeting={meeting} />);
                    return;
                case 'leadership':
                    setDetailComponent(<LeadershipMeetingDetails meeting={meeting} />);
                    return;
                case 'adhoc':
                    setDetailComponent(<AdhocMeetingDetails meeting={meeting} />);
                    return;
                default:
                    setDetailComponent(<Box>Meeting details</Box>)
            }
        }
    };

    function refreshTeams() {
        teamService.getAll()
            .then(tt => setTeams(tt));
    }

    function refreshMeeting() {
        meetingService.findByMonth(month)
            .then(meetings => {
                switch (meetingType) {
                    case 'all':
                        setMeetings(meetings);
                        break;
                    case 'my':
                        if (profileId) {
                            meetingAttendeeService
                                .findByProfileId(profileId)
                                .then(atts => {
                                    const attend_ids = atts.map(att => att.meeting_id);
                                    setMeetings(meetings.filter(meet => attend_ids.includes(meet.id)));
                                })
                        }
                        break;
                    case 'team':
                        const found = meetings
                            .filter(m => m.type === meetingType)
                            .filter(m => teamId === 'all' || m.team_id === teamId)
                        setMeetings(found);
                        break;
                    default:
                        setMeetings(meetings.filter(m => m.type === meetingType));
                        break;
                }
            });
    }


    function CustomDay(props: PickersDayProps) {
        const { day, outsideCurrentMonth, ...other } = props;
        const found = meetings
            .map(m => m.start_date)
            .filter(d => dayjs(d).isSame(dayjs(day), 'day'));

        const color = found.length === 0
            ? ''
            : '#2f962fff';

        return (
            <PickersDay {...other}
                sx={{
                    [`&.${pickersDayClasses.selected}`]: {
                        backgroundColor: color
                    }
                }}
                selected={found.length > 0}
                onClick={(evt) => console.log(evt)}
                outsideCurrentMonth={outsideCurrentMonth} day={day} />
        );
    }

    function handleDateChange(newValue: PickerValue) {
        console.log(newValue!.date);
    }

    return (
        <Card>
            <CardHeader title="Meetings" >
            </CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={3}
                        sx={{ backgroundColor: theme.palette.background.default }}>
                        <Stack gap={1}>
                            <DateCalendar
                                value={dayjs(month)}
                                slots={{
                                    day: CustomDay,
                                }}
                                onMonthChange={(newMonth) => setMonth(newMonth.toDate())}
                                onChange={(newValue) => handleDateChange(newValue)}
                            />
                            <Select value={meetingType} onChange={(evt) => setMeetingType(evt.target.value)}>
                                <MenuItem value="my">My meetings</MenuItem>
                                <MenuItem value="all">All meetings</MenuItem>
                                <MenuItem value="plenary">Plenary</MenuItem>
                                <MenuItem value="leadership">Leadership</MenuItem>
                                <MenuItem value="team">Team</MenuItem>
                                <MenuItem value="adhoc">Ad hoc</MenuItem>
                            </Select>
                            {meetingType === 'team' &&
                                <Select value={teamId} onChange={(evt) => setTeamId(evt.target.value)}>
                                    <MenuItem key={'all'} value="all">All teams</MenuItem>
                                    {teams.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                                </Select>
                            }
                            <List>
                                {meetings.map(m =>
                                    <ListItem key={m.id}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => handleMeetingChange(m)}>
                                        {m.name} {dayjs(m.start_date).format("MM/DD/YYYY hh:mm a")}
                                    </ListItem>)}
                            </List>
                        </Stack>
                    </Grid>
                    <Grid size={9}>
                        {detailComponent}
                    </Grid>
                </Grid>
            </CardContent>
        </Card >
    );
};

export default AllMeetingsPage;