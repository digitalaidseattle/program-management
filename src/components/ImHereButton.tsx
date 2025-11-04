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
    const [status, setStatus] = useState<string>();

    useEffect(() => {
        auth.getUser()
            .then(user => {
                if (user && meeting.meeting_attendee) {
                    setMeetingAttendee(meeting.meeting_attendee.find(ma => ma.email.toLowerCase() === user.email.toLowerCase()))
                }
            });
    }, [auth]);

    useEffect(() => {
        if (meetingAttendee) {
            if (meetingAttendee.present) {
                setStatus("present");
            } else {
                setStatus("not present");
            }
        } else {
            setStatus("invalid");
        }
    }, [meetingAttendee]);

    function handleClick() {
        if (meetingAttendee) {
            meetingAttendeeService.update(meetingAttendee.id, { present: true })
                .then((updated) => onChange(updated))
        }
    }

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

    };
}
export default ImHereButton;