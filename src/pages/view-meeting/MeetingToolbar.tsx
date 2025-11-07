/**
 *  MeetingToolbar.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Box, Button, Card, Checkbox, Grid, SxProps, Toolbar, Tooltip } from "@mui/material";
import { Meeting, meetingService } from "../../services/dasMeetingService";
import googleMeet from "../../assets/images/icons/google-meet.png";

export function MeetingToolbar({ entity: meeting, sx, onChange }: { entity: Meeting, sx?: SxProps, onChange: (updated: any) => void }) {

    function handleStatusChange(newStatus: 'new' | 'concluded' | undefined): void {
        if (meeting) {
            meetingService.update(meeting?.id, { status: newStatus })
                .then((updated) => onChange(updated));
        }
    }

    function handleOpenMeet(): void {
        if (meeting) {
            window.open(meeting.meeting_url, '_blank', 'rel=noopener noreferrer')
        }
    }

    return (<Grid item xs={12}>
        <Card>
            <Toolbar sx={{ gap: 2, ...sx }}>
                <Tooltip title={`Open Google meeing, ${meeting.meeting_url}, in a new window.`}>
                    <Button variant="outlined" onClick={() => handleOpenMeet()}>
                        <img height={26} src={googleMeet} />
                    </Button>
                </Tooltip>
                <Tooltip title={`Create a new meeting.`}>
                    <Button variant="outlined" onClick={() => alert('One day this will show a dialog to clone this meeting.')}>New</Button>
                </Tooltip>
                <Box style={{ flexGrow: 1 }} />
                <Box><Checkbox value={meeting.status === 'concluded'}
                    disabled={meeting.status === 'concluded'}
                    onClick={() => handleStatusChange('concluded')} />Concluded</Box>
            </Toolbar>
        </Card>
    </Grid>
    )
}