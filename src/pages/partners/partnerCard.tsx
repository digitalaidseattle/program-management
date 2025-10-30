/**
 *  PartnerCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Entity, useStorageService } from '@digitalaidseattle/core';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router';
import { Partner } from '../../services/dasPartnerService';

type EntityCardProps<T extends Entity> = {
    entity: T
    cardStyles?: any
}

export const PartnerCard: React.FC<EntityCardProps<Partner>> = ({ entity: partner, cardStyles }) => {
    const navigate = useNavigate();
    const storageService = useStorageService()!;

    return (
        <Card
            key={partner.id}
            sx={{
                flex: '1',
                minWidth: { xs: '100%', sm: '17rem' },
                maxWidth: 240,
                boxShadow:
                    '0px 4px 8px 0px rgba(52, 61, 62, 0.08), 0px 8px 16px 0px rgba(52, 61, 62, 0.08)',
                ...cardStyles,
            }}

        >
            <CardActionArea onClick={() => { console.log(`/partner/${partner.id}`); navigate(`/partner/${partner.id}`) }}>
                <CardMedia
                    component="img"
                    sx={{
                        height: 150,
                        maxWidth: 300,
                        objectFit: 'contain',
                    }}
                    src={storageService.getUrl(`logos/${partner.id}`)}
                    title={partner.name + ' logo'}
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
                    <Typography variant='h4'>{partner.name}</Typography>
                    <Typography variant='subtitle1'>{partner.type}</Typography>
                    <Typography>{partner.status}</Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    )
}