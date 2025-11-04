/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Button, SxProps, Tooltip, Typography } from "@mui/material";
import { Meeting, MeetingAttendee, meetingAttendeeService } from "../services/dasMeetingService";
import { useAuthService } from "@digitalaidseattle/core";
import { useEffect, useState } from "react";
import { CheckOutlined } from "@ant-design/icons";

function ImHereButton({ meeting, sx, onChange }: { meeting: Meeting, sx?: SxProps, onChange: (ma: MeetingAttendee) => void }) {
    const auth = useAuthService();
    const [meetingAttendee, setMeetingAttendee] = useState<MeetingAttendee>();

    useEffect(() => {
        auth.getUser()
            .then(user => {
                if (user && meeting.meeting_attendee) {
                    setMeetingAttendee(meeting.meeting_attendee.find(ma => ma.email.toLowerCase() === user.email.toLowerCase()))
                }
            });
    }, [auth, meeting]);

    function handleClick() {
        if (meetingAttendee) {
            meetingAttendeeService.update(meetingAttendee.id, { status: 'present' })
                .then((updated) => onChange(updated))
        }
    }

<<<<<<< HEAD
    function getButton(attendee?: MeetingAttendee) {
        if (attendee) {
            if (attendee.status === "present") {
                return <Tooltip title='Marked as present' ><CheckOutlined style={{ color: 'green', fontSize: '24px' }} /></Tooltip>
            } else {
                return (<Button variant="outlined"
                    sx={{ ...sx }}
                    onClick={() => handleClick()}> I'm here</Button>)
            }
        } else {
            return (
                <Typography sx={{ color: 'red', ...sx }}>
                    You are not registered for this meeting.</Typography >)
        }
    }

    return getButton(meetingAttendee)
=======
    switch (status) {
        case 'present':
            return <CheckOutlined style={{ color: 'success', fontSize: '24px' }} />
        case 'not present':
            return (<Button variant="outlined"
                sx={{ ...sx }}
                onClick={() => handleClick()}> I'm here</Button>);
        case 'unknown':
            return (
                <Typography variant="h2" sx={{ color: 'red', ...sx }}>
                    You are not registered for this meeting.</Typography >);
        default:
            return (null);
>>>>>>> a6267dc (fix plenary)

}
export default ImHereButton;