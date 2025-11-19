/**
 *  MyMeetingsWidget.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Card, CardContent, CardHeader, List, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { Meeting, meetingAttendeeService } from '../../services/dasMeetingService';
import { useAuthService } from '@digitalaidseattle/core';
import { volunteerService } from '../../services/dasVolunteerService';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

export const MyMeetingsWidget = () => {
    const authService = useAuthService();

    const [profileId, setProfileId] = useState<string>();
    const [meetings, setMeetings] = useState<Meeting[]>([]);

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
        if (profileId) {
            findCurrentMeetings(profileId)
                .then(meetings => setMeetings(meetings));
        }
    }, [profileId]);

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