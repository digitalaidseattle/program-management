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
    }, [auth, meeting]);

    useEffect(() => {
        console.log(meetingAttendee)
        if (meetingAttendee) {
            setStatus(meetingAttendee.status ?? 'unknown')
        }
    }, [meetingAttendee]);

    function handleClick() {
        if (meetingAttendee) {
            meetingAttendeeService.update(meetingAttendee.id, { status: 'present' })
                .then((updated) => onChange(updated))
        }
    }

    function render() {
        switch (status) {
            case 'present':
                return <CheckOutlined style={{ color: 'success', fontSize: '24px' }} />
            case 'absent':
            case 'unknown':
                return (<Button variant="outlined"
                    sx={{ ...sx }}
                    onClick={() => handleClick()}> I'm here</Button>);
            default:
                return (
                    <Typography variant="h2" sx={{ color: 'red', ...sx }}>
                        You are not registered for this meeting.</Typography >);
        }
    }
    return render();
}
export default ImHereButton;