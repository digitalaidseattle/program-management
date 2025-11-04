/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Button, SxProps, Typography } from "@mui/material";
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
    }, [auth]);

    function handleClick() {
        if (meetingAttendee) {
            meetingAttendeeService.update(meetingAttendee.id, { status: 'present' })
                .then((updated) => onChange(updated))
        }
    }

    if (meetingAttendee) {
        if (meetingAttendee.status == 'present') {
            return <CheckOutlined style={{ color: 'success', fontSize: '24px' }} />
        } else {
            return (<Button variant="outlined"
                sx={{ ...sx }}
                onClick={() => handleClick()}> I'm here</Button>);
        }
    }
    else {
        return (
            <Typography sx={{ color: 'red', ...sx }}>
                You are not registered for this meeting.</Typography >);
    }
}
export default ImHereButton;