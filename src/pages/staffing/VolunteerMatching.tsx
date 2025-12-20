/**
 *  AllPositions.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import {
    Avatar,
    Box,
    Button,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from "@mui/material";
import { useEffect, useState } from "react";

import { useNotifications } from "@digitalaidseattle/core";
import { storageService } from "../../App";
import { ScrollList } from "../../components/ScrollList";
import { Staffing, staffingService } from "../../services/dasStaffingService";
import { Volunteer, volunteerService } from "../../services/dasVolunteerService";

const VolunteerMatching = () => {
    const theme = useTheme();
    const notifications = useNotifications();

    const [staffing, setStaffing] = useState<Staffing[]>([]);

    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [unAssigned, setUnAssigned] = useState<Volunteer[]>([]);
    const [openPositions, setOpenPositions] = useState<Staffing[]>([]);

    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer>();
    const [selectedStaffing, setSelectedStaffing] = useState<Staffing>();

    useEffect(() => {
        refresh();
    }, []);

    const ACTIVE_STAFFING_STATUSES = ["Proposed", "Filled", "Please fill", "Maybe filled"];

    useEffect(() => {
        const volunteerIds = staffing
            .filter(s => ACTIVE_STAFFING_STATUSES.includes(s.status))
            .map(s => s.volunteer_id)
            .filter(id => id);
        const unassigned = volunteers
            .filter(vol => vol.status === 'Contributor')
            .filter(vol => !volunteerIds.includes(vol.id));
        setUnAssigned(unassigned);
    }, [volunteers, staffing]);

    useEffect(() => {
        const unfilled = staffing
            .filter(s => s.status === "Please fill")
            .filter(s => !s.volunteer_id)
        setOpenPositions(unfilled);
    }, [staffing]);

    function refresh() {
        Promise.all([staffingService.getAll(), volunteerService.getActive()])
            .then(resp => {
                setStaffing(resp[0]);
                setVolunteers(resp[1]);
            });
    }

    function getOrganizationName(staffing: Staffing): string | undefined {
        if (staffing.venture) {
            return staffing.venture.venture_code
        }
        if (staffing.team) {
            return 'DAS: ' + staffing.team.name;
        }
        return undefined;
    }

    function voluteerCard(volunteer: Volunteer): React.ReactNode {
        return (
            <Card
                sx={{
                    width: "100%",
                    boxShadow: 'none',
                    '&': {
                        '&:hover': {
                            background: theme.palette.background.default,
                            boxShadow:
                                '0px 8px 8px 2px rgba(52, 61, 62, 0.1), 0px 8px 4px rgba(52, 61, 62, 0.1)',
                        },
                    },
                    background: selectedVolunteer ? volunteer.id === selectedVolunteer!.id ? theme.palette.grey[200] : 'none' : 'none'
                }}>
                <CardHeader
                    title={<Box>
                        <Typography sx={{ fontWeight: 600 }}>{volunteer.profile!.name}</Typography>
                        <Typography>{volunteer.position}</Typography>
                    </Box>}
                    avatar={<Avatar
                        src={storageService.getUrl(`profiles/${volunteer.profile!.id}`)}
                        alt={`${volunteer.profile!.name} picture`}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                        variant="rounded" />}
                />
            </Card >
        )
    }

    function positionCard(staffing: Staffing): React.ReactNode {
        return (
            <Card
                sx={{
                    width: "100%",
                    boxShadow: 'none',
                    '&': {
                        '&:hover': {
                            background: theme.palette.background.default,
                            boxShadow:
                                '0px 8px 8px 2px rgba(52, 61, 62, 0.1), 0px 8px 4px rgba(52, 61, 62, 0.1)',
                        },
                    },
                    background: selectedStaffing ? staffing.id === selectedStaffing!.id ? theme.palette.grey[200] : 'none' : 'none'
                }}>
                <CardHeader
                    title={<Box>
                        <Typography sx={{ fontWeight: 600 }}>{getOrganizationName(staffing)}</Typography>
                        <Typography>{staffing.role!.name}</Typography>
                    </Box>}
                />
            </Card >
        )
    }

    function handleSelectVolunteer(item: Volunteer) {
        setSelectedVolunteer(item);

    }

    function handleSelectStaffing(item: Staffing) {
        setSelectedStaffing(item);
    }

    function assign() {
        if (selectedStaffing && selectedVolunteer) {
            staffingService.update(selectedStaffing.id, { volunteer_id: selectedVolunteer.id, status: 'Filled' })
                .then(updating => {
                    notifications.success(`Added ${updating.volunteer!.profile!.name} to ${getOrganizationName(updating)}.`);
                    refresh();
                })
                .finally(() => {
                    setSelectedVolunteer(undefined);
                    setSelectedStaffing(undefined);
                })
        }
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center" sx={{ borderBottom: 1 }}><Typography fontWeight={600}>Unassigned Contributors</Typography></TableCell>
                    <TableCell></TableCell>
                    <TableCell align="center" sx={{ borderBottom: 1 }}><Typography fontWeight={600}>Open Position</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody >
                <TableRow>
                    <TableCell valign="top" sx={{ border: 1 }}>
                        <Box>
                            <ScrollList
                                items={unAssigned}
                                listItemRenderer={voluteerCard}
                                selectedItem={selectedVolunteer}
                                onSelect={handleSelectVolunteer} />
                        </Box>
                    </TableCell>
                    <TableCell align='center' sx={{ verticalAlign: 'top' }} onClick={() => assign()}>
                        <Button variant="contained" disabled={!(selectedStaffing && selectedVolunteer)}>Assign</Button>
                    </TableCell>
                    <TableCell sx={{ border: 1, verticalAlign: 'top' }}>
                        <ScrollList
                            items={openPositions}
                            listItemRenderer={positionCard}
                            selectedItem={selectedStaffing}
                            onSelect={handleSelectStaffing} />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default VolunteerMatching;