/**
 *  ListItem.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Avatar, Card, CardHeader } from "@mui/material";
import { EntityCardProps } from "../../components/utils";
import { Team } from "../../services/dasTeamService";
import { SupabaseStorage } from "../../services/supabaseStorage";

const supabaseStorage = new SupabaseStorage();

export const ListItem: React.FC<EntityCardProps<Team>> = ({ entity, cardStyles }) => {
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
            <CardHeader
                title={entity.name}
                avatar={
                    <Avatar
                        alt={entity.name}
                        src={supabaseStorage.getUrl(`icons/${entity.id}`)}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                        variant="rounded"
                    />}
            />
        </Card >
    )
}