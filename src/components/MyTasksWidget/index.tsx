/**
 *  MyTasksWidget/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Card, CardContent, CardHeader, List, ListItemButton, ListItemText } from '@mui/material';
import { useState } from 'react';
import AddMeetingDialog from '../AddMeetingDialog';
import VentureReportDialog from '../VentureReportDialog';
import { VentureReportService } from '../../services/dasVentureReportService';

export const MyTasksWidget = () => {
    const [showAddMeetingDialog, setShowAddMeetingDialog] = useState<boolean>(false);
    const [showAddVentureReportDialog, setShowAddVentureReportDialog] = useState<boolean>(false);

    return (
        <Card sx={{ height: "100%" }}>
            <CardHeader title="Quick Links" />
            <CardContent>
                <List>
                    {/* <ListItemButton>
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
                    </ListItemButton> */}
                    <ListItemButton
                        onClick={() => setShowAddVentureReportDialog(true)} >
                        <ListItemText>Create Venture Report</ListItemText>
                    </ListItemButton>
                </List>
                <AddMeetingDialog
                    title={'Add meeting'}
                    meetingTypes={['adhoc', 'team']}
                    onClose={() => setShowAddMeetingDialog(false)}
                    open={showAddMeetingDialog} />
                <VentureReportDialog
                    title={'Add Venture Report'}
                    report={VentureReportService.instance().empty()}
                    onClose={() => setShowAddVentureReportDialog(false)}
                    open={showAddVentureReportDialog} />
            </CardContent>
        </Card>
    );
}