// material-ui
import {
    Avatar,
    Box,
    Button,
    Card,
    IconButton,
    Toolbar,
    Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';

import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { EntityProps } from '../../components/utils';
import { Meeting, MeetingAttendee, meetingAttendeeService } from '../../services/dasMeetingService';
import { Volunteer, volunteerService } from '../../services/dasVolunteerService';
import { useNotifications, useStorageService } from '@digitalaidseattle/core';
import SelectItemDialog from '../../components/SelectItemDialog';


function AttendeesCard({ entity: meeting, onChange }: EntityProps<Meeting>) {
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);

    const [available, setAvailable] = useState<Volunteer[]>([]);
    const storageService = useStorageService()!;

    const columns: GridColDef<MeetingAttendee[][number]>[] = [
        {
            field: 'id',
            headerName: '',
            width: 50,
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                >
                    <DeleteOutlined />
                </IconButton>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'profile.pic',
            headerName: '',
            width: 100,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Avatar
                        alt={params.row.profile ? params.row.profile.name : ''}
                        src={storageService.getUrl(`profiles/${params.row.profile!.id}`)}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                        variant="rounded"
                    />
                </Box>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'profile.name', headerName: 'Name', width: 175,
            valueGetter: (_value: any, row: any) => {
                return `${row.profile.name ?? ''}`
            }
        },
        {
            field: 'email', headerName: 'Email', width: 300,
        },
        {
            field: 'present', headerName: 'Attendance', width: 300,
        },

    ]

    const notifications = useNotifications();

    useEffect(() => {
        if (meeting) {
            setAttendees(meeting.meeting_attendee ?? []);
            volunteerService.getActive()
                .then(volunteers => {
                    const attendeeIds = new Set((meeting.meeting_attendee ?? []).map(a => a.profile_id));
                    setAvailable(volunteers
                        .filter(v => !attendeeIds.has(v.profile!.id))
                        .sort((a, b) => a.profile!.name.localeCompare(b.profile!.name))
                    );
                });
        }
    }, [meeting]);


    function CustomToolbar() {
        return (
            <Toolbar sx={{ gap: 2, backgroundColor: 'background.default' }}>
                <Tooltip title="Add Single Attendee">
                    <IconButton color="primary" onClick={() => setShowDialog(true)} >
                        <PlusCircleOutlined />
                    </IconButton>
                </Tooltip>
                {meeting.type === 'plenary' &&
                    <Tooltip title="Adds all volunteers." onClick={() => setShowConfirmationDialog(true)}>
                        <Button variant="outlined">Add Everyone...</Button>
                    </Tooltip>
                }
            </Toolbar>
        );
    }

    function handleDelete(id: string | null | undefined): void {
        if (id) {
            meetingAttendeeService.delete(id)
                .then(updated => {
                    notifications.success(`Attendee removed.`);
                    onChange(updated)
                });
        }
    }

    function handleAddAttendee(volunteerId: string | null | undefined): void {
        if (volunteerId) {
            const volunteer = available.find(v => v.id === volunteerId);
            if (volunteer) {
                const attendee = meetingAttendeeService.createFromVolunteer(volunteer, meeting);
                meetingAttendeeService.insert(attendee)
                    .then(updated => {
                        notifications.success(`${volunteer.profile!.name} added as an attendee.'`);
                        onChange(updated)
                    })
                    .finally(() => setShowDialog(false));
            } else {
                console.error(`Volunteer with ID ${volunteerId} not found among available volunteers.`);
            }
        }
    }

    function handleAddAllVolunteers(): void {
        const attendees = available.map(volunteer => meetingAttendeeService.createFromVolunteer(volunteer, meeting));
        meetingAttendeeService.batchInsert(attendees)
            .then(updated => {
                notifications.success('All volunteers added as attendees.');
                onChange(updated);
            })
            .finally(() => setShowConfirmationDialog(false));
    }

    return (
        <Card>
            <DataGrid
                pagination={true}
                rows={attendees}
                columns={columns}
                pageSizeOptions={[10, 25, 100]}
                disableRowSelectionOnClick
                slots={{ toolbar: CustomToolbar }}
                showToolbar={true}
            />
            <SelectItemDialog
                open={showDialog}
                options={{
                    title: 'Add a volunteer',
                    description: 'Select a Cadre or Contributor to add as an attendee to this meeting.'
                }}
                records={available.map(v => ({ label: v.profile!.name, value: v.id }))}
                onSubmit={handleAddAttendee}
                onCancel={() => setShowDialog(false)} />
            <ConfirmationDialog
                open={showConfirmationDialog}
                title="Add All Volunteers"
                message={`Are you sure you want to add all volunteers as attendees to this meeting? This action cannot be undone.`}
                handleCancel={() => setShowConfirmationDialog(false)}
                handleConfirm={() => handleAddAllVolunteers()}
            />
        </Card>
    );
}

export { AttendeesCard };

