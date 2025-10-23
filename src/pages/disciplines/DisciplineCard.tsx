/**
 *  DisciplineCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Avatar, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { EntityCardProps } from "../../components/EntityGrid";
import { Discipline } from "../../services/dasDisciplineService";
import { SupabaseStorage } from "../../services/supabaseStorage";

const supabaseStorage = new SupabaseStorage();

export const DisciplineCard: React.FC<EntityCardProps<Discipline>> = ({ entity, cardStyles }) => {
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
            <CardActionArea onClick={() => navigate(`/discipline/${entity.id}`)}>
                <CardHeader title={entity.name}
                 avatar={
                        <Avatar
                            src={supabaseStorage.getUrl(`icons/${entity.id}`)}
                            alt={`${entity.name} icon`}
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
                    <Typography >{entity.status}</Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    )
}