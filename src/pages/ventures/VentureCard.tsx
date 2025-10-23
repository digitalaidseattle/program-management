/**
 *  VolunteerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { Venture } from "../../services/dasVentureService";
import { EntityCardProps } from "../../components/EntityGrid";
import Markdown from "react-markdown";

export const VentureCard: React.FC<EntityCardProps<Venture>> = ({ entity, cardStyles }) => {
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
            <CardActionArea onClick={() => navigate(`/volunteer/${entity.id}`)}>
                <CardHeader title={entity.venture_code} />

                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        paddingBottom: '1rem !important',
                    }}
                >
                    {entity.status}
                </CardContent>
            </CardActionArea>
        </Card >
    )
}