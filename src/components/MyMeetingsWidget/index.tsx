/**
 *  MyMeetingsWidget.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { PlusCircleOutlined } from '@ant-design/icons';
import { LoadingContext, useNotifications } from '@digitalaidseattle/core';
import { Card, CardContent, CardHeader, IconButton, List, ListItem } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVolunteer } from '../../hooks/useVolunteer';
import { Meeting, meetingAttendeeService } from '../../services/dasMeetingService';
import AddMeetingDialog from '../AddMeetingDialog';

export const MyMeetingsWidget = () => {
    const navigate = useNavigate();
    const notification = useNotifications();
    const {  setLoading } = useContext(LoadingContext);

    const { volunteer } = useVolunteer();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [showAddMeetingDialog, setShowAddMeetingDialog] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (volunteer) {
            findCurrentMeetings(volunteer.profile_id)
                .then(meetings => setMeetings(meetings))
                .finally(() => setLoading(false));
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

    function handleClose(evt: any) {
        if (evt.meeting) {
            notification.success('Meeting added.');
            navigate(`/meeting/${evt.meeting.id}`);
        }
        setShowAddMeetingDialog(false);
    }

    return (
        <Card >
            <CardHeader
                title="My Meetings"
                action={<IconButton onClick={() => setShowAddMeetingDialog(true)}><PlusCircleOutlined /></IconButton>} />
            <CardContent>
                <List>
                    {meetings.map(m =>
                        <ListItem key={m.id} >
                            <Link to={`meeting/${m.id}`}>{dayjs(m.start_date).format('MM/DD/YYYY hh:mm a')} {m.name}</Link>
                        </ListItem>
                    )}
                </List>
                <AddMeetingDialog
                    title={'Add meeting'}
                    meetingTypes={['adhoc', 'team']}
                    onClose={handleClose}
                    open={showAddMeetingDialog} />
            </CardContent>
        </Card>
    );
}