/**
 * 
 * ReferenceVolunteerDetails.tsx
 * 
 */
import { Avatar, Box, Card, CardContent, CardHeader, Grid } from "@mui/material";
import dayjs from "dayjs";
import { ProfileService } from "../../services/dasProfileService";
import { Volunteer } from "../../services/dasVolunteerService";
// import { TeamsCard } from "./TeamsCard";
// import { DisciplinesCard } from "./DisplinesCard";
// import { ToolsCard } from "./ToolsCard";
// import { VenturesCard } from "./VenturesCard";

const ReferenceVolunteerDetails = ({ entity }: { entity: Volunteer }) => {
    const profileService = ProfileService.getInstance();

    return (
        <Card>
            <CardHeader title={entity.name} />
            <CardContent>
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
                        <p>LinkedIn: {entity.linkedin}</p>
                        <p>Email: {entity.email}</p>
                        <p>Location: {entity.location}</p>
                        <p>Position: {entity.position}</p>
                    </Grid>
                    <Grid size={12}>
                        {/* <TeamsCard entity={entity} /> */}
                       {/*  <DisciplinesCard entity={entity} />
                        <ToolsCard entity={entity} />
                        <VenturesCard entity={entity} /> */}
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    );
}
export { ReferenceVolunteerDetails };
