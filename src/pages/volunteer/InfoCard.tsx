/**
 * 
 * InfoCard.tsx
 * 
 */

import { Avatar, Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { ProfileService } from "../../services/dasProfileService";
import { Volunteer } from "../../services/dasVolunteerService";

export const InfoCard = ({ entity }: { entity: Volunteer }) => {
    const profileService = ProfileService.getInstance();

    return (
        <Grid container spacing={2}>
            <Grid size={6}>
                <Box
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: 'grey.50',
                        border: (t) => `1px solid ${t.palette.divider}`,
                        height: { xs: 180, sm: 220, md: 240 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                    }}
                >
                    <Avatar
                        src={profileService.getPicUrl(entity)}
                        alt={`${entity.name} picture `}
                        variant="rounded"
                        sx={{
                            borderRadius: 3,
                            width: '100%',
                            height: '100%',
                            fontSize: 48,
                            bgcolor: 'grey.100',
                            color: 'text.secondary',
                            '& .MuiAvatar-img': {
                                objectFit: 'contain',
                                width: '100%',
                                height: '100%',
                            },
                        }}
                    >
                        {entity.name ?? '?'}
                    </Avatar>
                </Box>
            </Grid>
            <Grid size={6}>
                <p>Join Date: {dayjs(entity.join_date).format('MMMM D, YYYY')}</p>
                <p>Status: {entity.status}</p>
                <p>LinkedIn: <NavLink to={entity.linkedin} target="_blank">{entity.linkedin}</NavLink></p>
                <p>Email: {entity.email}</p>
                <p>Location: {entity.location}</p>
                <p>Position: {entity.position}</p>
            </Grid>
        </Grid>
    );
}
