/**
 *  MyTasksWidget/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Card, CardContent, CardHeader, List, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import AddMeetingDialog from '../AddMeetingDialog';
import { useState } from 'react';

export const MyTasksWidget = () => {
    const [showAddMeetingDialog, setShowAddMeetingDialog] = useState<boolean>(false);

    return (
        <Card sx={{ height: "100%" }}>
            <CardHeader title="Quick Links" />
            <CardContent>
                <List>
                    <ListItemButton>
                        <Link
                            style={{ 'textDecoration': 'none' }}
                            color="secondary"
                            to={`/profile`}>
                            Edit My Profile
                        </Link>
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => setShowAddMeetingDialog(true)} >
                        <ListItemText>Schedule A Meeting</ListItemText>
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => alert('NRFPT')} >
                        <ListItemText>My Time Off</ListItemText>
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => alert('NRFPT')} >
                        <ListItemText>Enter Venture Report</ListItemText>
                    </ListItemButton>
                </List>
                <AddMeetingDialog
                    title={'Add meeting'}
                    meetingTypes={['adhoc', 'team']}
                    onClose={() => setShowAddMeetingDialog(false)}
                    open={showAddMeetingDialog} />
            </CardContent>
        </Card>
    );
}