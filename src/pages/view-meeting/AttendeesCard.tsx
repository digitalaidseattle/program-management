import {
    Avatar,
    Box,
    Card,
    CardHeader,
    SxProps
} from "@mui/material";
import { useEffect, useState } from "react";
import { Meeting, MeetingAttendee } from "../../services/dasMeetingService";


import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useStorageService } from "@digitalaidseattle/core";
import { CARD_HEADER_SX } from "./utils";


function AttendeesCard({ entity: meeting }: { entity: Meeting, sx?: SxProps, onChange: (updated: any) => void }) {
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
    const storageService = useStorageService()!;

    useEffect(() => {
        if (meeting) {
            setAttendees(meeting.meeting_attendee!)
        }
    }, [meeting])

    return (
        <Card>
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title="Attendees" />
            <Box
                sx={{
                    height: "100%",             // fill parent container height
                    overflowY: "auto",          // enable vertical scroll
                    overflowX: "hidden",        // hide horizontal scroll (optional)
                    boxSizing: "border-box",    // include padding in height calc
                }}
            >
                {attendees.map((attendee, idx) =>
                (<Card
                    key={idx}
                    sx={{
                        width: "100%",
                        boxShadow: 'none'
                    }}
                >
                    <CardHeader
                        title={attendee.profile!.name}
                        avatar={<Avatar
                            src={storageService.getUrl(`profiles/${attendee.profile!.id}`)}
                            alt={`${attendee.profile!.name} picture`}
                            sx={{ width: 40, height: 40, objectFit: 'contain' }}
                            variant="rounded" />}
                        action={
                            <Box sx={{ marginTop: 1.5 }}>
                                {attendee.status === 'present' && <CheckCircleOutlined style={{ color: 'green', fontSize: '20px' }} />}
                                {attendee.status === 'absent' && <CheckCircleOutlined style={{ color: 'red', fontSize: '20px' }} />}
                                {(attendee.status === null || attendee.status === 'unknown') && <QuestionCircleOutlined style={{ color: 'gray', fontSize: '20px' }} />}
                            </Box>}
                    />
                </Card >)
                )}
            </Box>
        </Card>
    )
}

export { AttendeesCard };
