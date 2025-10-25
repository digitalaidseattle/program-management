/**
 *  VolunteerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Card, CardContent, CardMedia, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { Volunteer } from "../services/dasVolunteerService";
import { SupabaseStorage } from "../services/supabaseStorage";

type EntityCardProps<T> = {
    entity: T;
    highlightOptions?: {
        highlight: boolean;
        title: string;
    };
    cardStyles?: any;
}

const STATUS_COMP: { [key: string]: JSX.Element } = {
    'Cadre': <Chip label='Cadre' color='primary' />,
    'Contributor': <Chip label='Contributor' color='success' />,
    'past': <Chip label='Past' color='warning' />,
    'taking a break': <Chip label='Taking a break' color='default' />
}

const supabaseStorage = new SupabaseStorage();

export const VolunteerCard: React.FC<EntityCardProps<Volunteer>> = ({ entity: volunteer, highlightOptions, cardStyles }) => {
    const navigate = useNavigate();


    function changeHighlight() {
        alert(`TODO toggle ${volunteer.profile!.name}`);

    }
    return (
        <Card
            key={volunteer.id}
            sx={{
                padding: 1,
                flex: '1',
                minWidth: { xs: '100%', sm: '17rem' },
                maxWidth: 240,
                boxShadow:
                    '0px 4px 8px 0px rgba(52, 61, 62, 0.08), 0px 8px 16px 0px rgba(52, 61, 62, 0.08)',
                ...cardStyles,
            }}
        >
            <CardMedia
                component="img"
                sx={{
                    height: 150,
                    maxWidth: 300,
                    objectFit: 'contain',
                    cursor: 'pointer'
                }}
                src={supabaseStorage.getUrl(`profiles/${volunteer.profile!.id}`)}
                title={volunteer.profile!.name + ' photo'}
                onClick={() => navigate(`/volunteer/${volunteer.id}`)}
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
                                onClick={() => changeHighlight()}
                                aria-label="favorite"
                                size="small"
                            >
                                {highlightOptions.highlight
                                    ? <StarFilled style={{ fontSize: '150%', color: 'yellow' }} />
                                    : <StarOutlined style={{ fontSize: '150%', color: 'gray' }} />
                                }
                            </IconButton>
                        </Tooltip>
                    }
                    <Typography variant='h4'>{volunteer.profile!.name}</Typography>
                </Stack>
                {STATUS_COMP[volunteer.status]}
            </CardContent>
        </Card >
    )
}