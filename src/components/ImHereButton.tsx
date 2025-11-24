/**
 *  taskDialog.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CheckOutlined } from "@ant-design/icons";
import { Button, SxProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useVolunteer } from "../hooks/useVolunteer";
import { Meeting, MeetingAttendee, meetingAttendeeService } from "../services/dasMeetingService";

function ImHereButton({ meeting, sx, onChange }: { meeting: Meeting, sx?: SxProps, onChange: (ma: MeetingAttendee) => void }) {
    const { volunteer } = useVolunteer();
    const [meetingAttendee, setMeetingAttendee] = useState<MeetingAttendee>();
    const [status, setStatus] = useState<string>('unknown');

    useEffect(() => {
        if (volunteer && meeting.meeting_attendee) {
            setMeetingAttendee(meeting.meeting_attendee.find(ma => ma.email.toLowerCase() === volunteer.das_email.toLowerCase()))
        }
    }, [volunteer, meeting]);

    useEffect(() => {
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