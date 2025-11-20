/**
 *  Meeting.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import {
    Card,
    CardContent, CardHeader,
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Meeting, meetingService } from "../../services/dasMeetingService";

import { dateToString, EntityProps } from "../../components/utils";

import { PlusCircleOutlined } from "@ant-design/icons";
import { RefreshContext } from "@digitalaidseattle/core";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import ImHereButton from "../../components/ImHereButton";
import { Forecast, OKR, Team, teamService } from "../../services/dasTeamService";
import { AttendeesCard } from "./AttendeesCard";
import { MeetingToolbar } from "./MeetingToolbar";
import { NotesCard } from "./NotesCard";
import { TopicsCard } from "./TopicsCard";
import { CARD_HEADER_SX } from "./utils";

function OKRsCard({ entity: meeting }: EntityProps<Meeting>) {
    const [team, setTeam] = useState<Team>();
    const [okrs, setOkrs] = useState<OKR[]>([]);

    useEffect(() => {
        if (meeting) {
            teamService.getById(meeting.team_id!)
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
            teamService.getById(meeting.team_id!)
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
                title={<Typography variant="h2">{meeting.name} : {dayjs(meeting.start_date).format('MM/DD/YYYY')}</Typography>}
                action={<ImHereButton
                    meeting={meeting}
                    onChange={() => refreshMeeting()} />}
            >
            </CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Card>
                            <MeetingToolbar entity={meeting} onChange={() => refreshMeeting()} />
                        </Card>
                    </Grid>
                    <Grid size={3}>
                        <Stack gap={2}>
                            <AttendeesCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Stack>
                    </Grid>
                    <Grid size={5}>
                        <Stack gap={2}>
                            <TopicsCard entity={meeting} onChange={() => refreshMeeting()} />
                            <ForecastsCard entity={meeting} onChange={() => refreshMeeting()} />
                            <OKRsCard entity={meeting} onChange={() => refreshMeeting()} />
                        </Stack>
                    </Grid>
                    <Grid size={4}>
                        <NotesCard entity={meeting} onChange={() => refreshMeeting()} />
                    </Grid>
                </Grid >
            </CardContent>
        </Card>
    );
};

export default TeamMeetingPage;