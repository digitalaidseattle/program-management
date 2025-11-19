/**
 *  MyMeetingsWidget.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Card, CardContent, CardHeader, List, ListItem } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVolunteer } from '../../hooks/useVolunteer';
import { Meeting, meetingAttendeeService } from '../../services/dasMeetingService';

export const MyMeetingsWidget = () => {
    const { volunteer } = useVolunteer();
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        if (volunteer) {
            findCurrentMeetings(volunteer.profile_id)
                .then(meetings => setMeetings(meetings));
        }
    }, [volunteer]);

    function findCurrentMeetings(profileId: string): Promise<Meeting[]> {
        return meetingAttendeeService
            .findByProfileId(profileId)
            .then(atts => {
                return atts
                    .map(att => att.meeting!)
                    .filter(meet => meet.status === 'new')
                    .filter(meet => dayjs(meet.start_date).isAfter(dayjs()))
                    .sort((m1, m2) => dayjs(m1.start_date).isBefore(dayjs(m2.start_date)) ? -1 : 1);
            });
    }

    return (
        <Card >
            <CardHeader title="My Meetings" />
            <CardContent>
                <List>
                    {meetings.map(m =>
                        <ListItem key={m.id} >
                            <Link to={`meeting/${m.id}`}>{dayjs(m.start_date).format('MM/DD/YYYY hh:mm a')} {m.name}</Link>
                        </ListItem>
                    )}
                </List>
            </CardContent>
        </Card>
    );
}