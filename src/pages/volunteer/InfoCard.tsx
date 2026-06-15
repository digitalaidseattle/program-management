/**
 * 
 * InfoCard.tsx
 * 
 */

import { NavLink } from "react-router-dom";

import { GithubOutlined, LinkedinOutlined, MailOutlined, SlackOutlined } from "@ant-design/icons";
import { Avatar, Box, Grid, IconButton } from "@mui/material";
import dayjs from "dayjs";

import { ProfileService } from "../../services/dasProfileService";
import { Volunteer } from "../../services/dasVolunteerService";
import { useEffect } from "react";

export const InfoCard = ({ entity }: { entity: Volunteer }) => {
    const profileService = ProfileService.getInstance();


    useEffect(() => {
        console.log(entity)
    }, [])
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
                <p>Location: {entity.location}</p>
                <p>Position: {entity.position}</p>
                <p>
                    {entity.linkedin && entity.linkedin !== "" &&
                        <IconButton
                            component={NavLink}
                            to={entity.linkedin.startsWith('https') ? entity.linkedin : `https://${entity.linkedin}`}
                            target="_blank"
                            aria-label="go to linked in"
                        >
                            <LinkedinOutlined />
                        </IconButton>
                    }
                    {entity.github && entity.github !== "" &&
                        <IconButton
                            component={NavLink}
                            to={entity.github.startsWith('https') ? entity.github : `https://github.com/${entity.github}`}
                            target="_blank"
                            aria-label="go to github"
                        >
                            <GithubOutlined />
                        </IconButton>
                    }
                    {entity.email && entity.email !== "" &&
                        <IconButton
                            component={NavLink}
                            to={`mailto://${entity.email}`}
                            target="_blank"
                            aria-label="mailto"
                        >
                            <MailOutlined />
                        </IconButton>
                    }

                    {entity.slack_id && entity.slack_id !== "" &&
                        <IconButton
                            component={NavLink}
                            to={`https://digitalaidseattle.slack.com/team/${entity.slack_id}`}
                            target="_blank"
                            aria-label="mailto"
                        >
                            <SlackOutlined />
                        </IconButton>
                    }

                </p>
            </Grid>
        </Grid>
    );
}
