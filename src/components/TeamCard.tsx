import { useNavigate } from "react-router";
import { Avatar, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { Team } from "../services/dasTeamService";
import { SupabaseStorage } from "../services/supabaseStorage";
import { EntityCardProps } from "./utils";

const supabaseStorage = new SupabaseStorage();

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
                    title={team.name}
                    avatar={
                        <Avatar
                            src={supabaseStorage.getUrl(`icons/${team.id}`)}
                            alt={`${team.name} icon`}
                            sx={{ width: 40, height: 40, objectFit: 'contain' }}
                            variant="rounded"
                        />
                    } />
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
