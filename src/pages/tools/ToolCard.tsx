/**
 *  VolunteerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Avatar, Card, CardActionArea, CardContent, CardHeader } from "@mui/material";
import Markdown from "react-markdown";
import { useNavigate } from "react-router";
import { EntityCardProps } from "../../components/utils";
import { Tool } from "../../services/dasToolsService";
import { SupabaseStorage } from "../../services/supabaseStorage";

const supabaseStorage = new SupabaseStorage();

export const ToolCard: React.FC<EntityCardProps<Tool>> = ({ entity, cardStyles }) => {
    const navigate = useNavigate();

    return (
        <Card
            key={entity.id}
            sx={{
                flex: '1',
                minWidth: { xs: '100%', sm: '17rem' },
                maxWidth: 240,
                boxShadow:
                    '0px 4px 8px 0px rgba(52, 61, 62, 0.08), 0px 8px 16px 0px rgba(52, 61, 62, 0.08)',
                ...cardStyles,
            }}
        >
            <CardActionArea onClick={() => navigate(`/tool/${entity.id}`)}>
                <CardHeader title={entity.name}
                    avatar={
                        <Avatar
                            src={supabaseStorage.getUrl(`logos/${entity.id}`)}
                            alt={`${entity.name} logo`}
                            sx={{ width: 40, height: 40, objectFit: 'contain' }}
                            variant="rounded"
                        />
                    }
                />
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        paddingBottom: '1rem !important',
                    }}
                >
                    <Markdown>{entity.overview}</Markdown>
                </CardContent>
            </CardActionArea>
        </Card >
    )
}