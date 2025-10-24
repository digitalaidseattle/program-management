/**
 *  VolunteerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Avatar, Card, CardHeader } from "@mui/material";
import { EntityCardProps } from "../../components/utils";
import { Tool } from "../../services/dasToolsService";
import { SupabaseStorage } from "../../services/supabaseStorage";

const supabaseStorage = new SupabaseStorage();

export const ListItem: React.FC<EntityCardProps<Tool>> = ({ entity: tool, cardStyles }) => {
    return (
        <Card
            key={tool.id}
            sx={{
                flex: '1',
                minWidth: { xs: '100%', sm: '17rem' },
                maxWidth: 240,
                boxShadow:
                    '0px 4px 8px 0px rgba(52, 61, 62, 0.08), 0px 8px 16px 0px rgba(52, 61, 62, 0.08)',
                ...cardStyles,
            }}
        >
            <CardHeader
                title={tool.name}
                avatar={
                    <Avatar
                        alt={tool.name}
                        src={supabaseStorage.getUrl(`logos/${tool.id}`)}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                    />}
            />
        </Card >
    )
}