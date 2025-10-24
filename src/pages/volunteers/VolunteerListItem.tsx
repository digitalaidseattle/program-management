/**
 *  VolunteerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Avatar, Card, CardHeader } from "@mui/material";
import { Volunteer } from "../../services/dasVolunteerService";
import { SupabaseStorage } from "../../services/supabaseStorage";
import { EntityCardProps } from "../../components/utils";

const supabaseStorage = new SupabaseStorage();

export const VolunteerListItem: React.FC<EntityCardProps<Volunteer>> = ({ entity: volunteer, cardStyles }) => {
    return (
        <Card
            key={volunteer.id}
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
                title={volunteer.profile!.name}
                avatar={
                    <Avatar
                        alt={volunteer.profile!.name}
                        src={supabaseStorage.getUrl(`profiles/${volunteer.profile!.id}`)}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                        variant="rounded"
                    />}
            />
        </Card >
    )
}