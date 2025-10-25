/**
 *  VolunteerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Avatar, Card, CardContent, CardHeader, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router";
import { EntityCardProps } from "../../components/utils";
import { Tool } from "../../services/dasToolsService";
import { SupabaseStorage } from "../../services/supabaseStorage";

const supabaseStorage = new SupabaseStorage();

type ToolCardProps<T> = EntityCardProps<T> & {
    highlightOptions?: {
        highlight: boolean;
        title: string;
        toggleHighlight: () => void
    };
}

const STATUS_COMP: { [key: string]: JSX.Element } = {
    'active': <Chip label='Active' color='primary' />,
    'inactive': <Chip label='Inactive' color='default' />
}

export const ToolCard: React.FC<ToolCardProps<Tool>> = ({ entity, cardStyles, highlightOptions }) => {
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
            <CardHeader title={entity.name}
                avatar={
                    <Avatar
                        src={supabaseStorage.getUrl(`logos/${entity.id}`)}
                        alt={`${entity.name} logo`}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                        variant="rounded"
                    />
                }
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/tool/${entity.id}`)}
            />
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '.5rem',
                    paddingBottom: '1rem !important',
                }}
            >
                <Stack direction={'row'} alignItems={'center'}>
                    {highlightOptions &&
                        <Tooltip title={highlightOptions.title}>
                            <IconButton
                                onClick={(event) => {
                                    event.preventDefault();
                                    highlightOptions.toggleHighlight();
                                }}
                                aria-label="favorite"
                                size="small"
                            >
                                {highlightOptions.highlight
                                    ? <StarFilled style={{ fontSize: '150%', color: '#bea907ff' }} />
                                    : <StarOutlined style={{ fontSize: '150%', color: 'gray' }} />
                                }
                            </IconButton>
                        </Tooltip>
                    }
                    {entity.status && STATUS_COMP[entity.status]}
                </Stack>
            </CardContent>
        </Card >
    )
}