import { useNavigate } from "react-router";
import { EntityCardProps } from "./EntityGrid";
import { Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { Team } from "../services/dasTeamService";

export const TeamCard: React.FC<EntityCardProps<Team>> = ({ entity: team, cardStyles }) => {
    const navigate = useNavigate();
    return (
        <Card
            key={team.id}
            sx={{
                flex: '1',
                minWidth: { xs: '100%', sm: '17rem' },
                maxWidth: 240,
                boxShadow:
                    '0px 4px 8px 0px rgba(52, 61, 62, 0.08), 0px 8px 16px 0px rgba(52, 61, 62, 0.08)',
                ...cardStyles,
            }}
        >
            <CardActionArea onClick={() => navigate(`/team/${team.id}`)}>
                <CardHeader
                    title={team.team_name} />
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        paddingBottom: '1rem !important',
                    }}
                >
                    <Typography>{team.slack_channel}</Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    )
}
