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
import { VentureReport, ventureReportSave, VentureReportService } from '../../services/dasVentureReportService';
import { useNotifications } from '@digitalaidseattle/core';

export const MyTasksWidget = () => {
    const notifications = useNotifications();
    const [showAddMeetingDialog, setShowAddMeetingDialog] = useState<boolean>(false);
    const [showAddVentureReportDialog, setShowAddVentureReportDialog] = useState<boolean>(false);

    function handleVentureReportClose(evt: { report: VentureReport | null | undefined; }): void {
        if (evt.report) {
            ventureReportSave(evt.report)
                .then(() => notifications.success('Thank you, the report has been added.'))
        }
        setShowAddVentureReportDialog(false)
    }

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
                    onClose={handleVentureReportClose}
                    open={showAddVentureReportDialog} />
            </CardContent>
        </Card>
    );
}