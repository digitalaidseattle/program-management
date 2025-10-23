/**
 *  VolunteerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useNavigate } from "react-router";
import { Volunteer } from "../services/dasVolunteerService";
import { Card, CardActionArea, CardContent, CardMedia, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { SupabaseStorage } from "../services/supabaseStorage";

type EntityCardProps<T> = {
    entity: T;
    highlightOptions?: {
        highlight: boolean;
        title: string;
    };
    cardStyles?: any;
}
const STATUS_COLORS = {
    'Cadre': 'primary',
    'Contributor': 'success',
    'past': 'warning',
    'taking a break': 'default',
} as any;

const supabaseStorage = new SupabaseStorage();

export const VolunteerCard: React.FC<EntityCardProps<Volunteer>> = ({ entity: volunteer, highlightOptions, cardStyles }) => {
    const navigate = useNavigate();

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
            <CardActionArea onClick={() => navigate(`/volunteer/${volunteer.id}`)}>
                <CardMedia
                    component="img"
                    sx={{
                        height: 150,
                        maxWidth: 300,
                        objectFit: 'contain',
                    }}
                    src={supabaseStorage.getUrl(`profiles/${volunteer.profile!.id}`)}
                    title={volunteer.profile!.name + ' photo'}
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
                    <Stack direction="row" alignItems={'center'}>
                        {highlightOptions &&
                            <Tooltip title={highlightOptions.title}>
                                <IconButton
                                    title={highlightOptions.title}
                                    // onClick={changeHighlight(idx)}
                                    aria-label="favorite"
                                    size="small">
                                    {highlightOptions.highlight
                                        ? <StarFilled style={{ fontSize: '150%', color: 'yellow' }} />
                                        : <StarOutlined style={{ fontSize: '150%', color: 'gray' }} />
                                    }
                                </IconButton>
                            </Tooltip>
                        }
                        <Typography variant='h4'>{volunteer.profile!.name}</Typography>
                    </Stack>
                    <Chip label={volunteer.status} color={STATUS_COLORS[volunteer.status]} />
                </CardContent>
            </CardActionArea>
        </Card >
    )
}