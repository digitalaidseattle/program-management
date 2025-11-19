/**
 *  AddMeetingDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import { Meeting, MeetingType } from '../services/dasMeetingService';
import { Team, teamService } from '../services/dasTeamService';
import { useVolunteer } from '../hooks/useVolunteer';
import { createAdhocMeeting } from '../actions/CreateAdhocMeeting';
import { createTeamMeeting } from '../actions/CreateTeamMeeting';
import { createPlenaryMeeting } from '../actions/CreatePlenary';
import { createLeadershipMeeting } from '../actions/CreateLeadershipMeeting';

// material-ui

interface AddMeetingDialogProps extends DialogProps {
    title: string;
    meetingTypes: MeetingType[];
    onClose: (evt: { meeting: Meeting | null | undefined }) => void;
}

const iconBackColorOpen = 'grey.300';
const iconBackColor = 'grey.100';
const LABELS = {
    'adhoc': 'Ad hoc',
    'team': 'Team',
    'plenary': 'Plenary',
    'leadership': 'Leadership'
}
const AddMeetingDialog: React.FC<AddMeetingDialogProps> = ({ title, meetingTypes, open, onClose }) => {
    const { volunteer } = useVolunteer();
    const [teams, setTeams] = useState<Team[]>([]);
    const [meetingType, setMeetingType] = useState<string>('adhoc');
    const [selectedTeam, setSelectedTeam] = useState<string>();

    useEffect(() => {
        teamService.getAll()
            .then(tms => setTeams(tms.sort((a, b) => a.name.localeCompare(b.name))));
    }, []);


    function handleCancel() {
        onClose({ meeting: null });
    }

    function handleSubmit() {
        switch (meetingType) {
            case 'adhoc':
                if (volunteer) {
                    createAdhocMeeting(volunteer!)
                        .then(meeting => onClose({ meeting: meeting }));
                }
                break;
            case 'team':
                if (selectedTeam) {
                    createTeamMeeting(teams.find(t => t.id === selectedTeam)!)
                        .then(meeting => onClose({ meeting: meeting }));
                }
                break;
            case 'plenary':
                createPlenaryMeeting()
                    .then(meeting => onClose({ meeting: meeting }));
                break;
            case 'leadership':
                createLeadershipMeeting()
                    .then(meeting => onClose({ meeting: meeting }));
                break;
        }
        const meeting = {} as Meeting;
        onClose({ meeting: meeting });
    }

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={() => onClose({ meeting: null })}>
            <DialogTitle >
                <Typography variant='h4'>{title}</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    <Typography>Select meeting type</Typography>
                    <Select value={meetingType} onChange={evt => setMeetingType(evt.target.value)}>
                        {meetingTypes.map(item => <MenuItem key={item} value={item}>{LABELS[item]}</MenuItem>)}
                    </Select>
                    <Typography>Select team</Typography>
                    <Select value={selectedTeam}
                        disabled={meetingType !== 'team'}
                        onChange={evt => setSelectedTeam(evt.target.value)}>
                        {teams.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                    </Select>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.secondary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={handleCancel}>Cancel</Button>
                <Button
                    variant='outlined'
                    sx={{ color: 'text.success', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    onClick={handleSubmit}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}
export default AddMeetingDialog;
