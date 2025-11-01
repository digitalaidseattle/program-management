
// material-ui
import {
    Button,
    Card,
    CardContent,
    CardHeader
} from '@mui/material';
import { EntityProps } from '../../components/utils';
import { OKR, Team } from '../../services/dasTeamService';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import OKRsDialog from './OKRsDialog';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }

const OKRsCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
    const [okrs, setOkrs] = useState<OKR[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        if (entity) {
            const today = dayjs();
            setOkrs((entity.okr ?? [])
                .filter(f => dayjs(f.end_date).isAfter(today)));
        }
    }, [entity]);

    return (entity &&
        <Card>
            <CardHeader
                titleTypographyProps={{ fontSize: 24 }}
                title='OKRs'
                subheader='Current OKRs, click Edit to see all'
                action={
                    <Button onClick={() => setShowDialog(true)}>Edit</Button>
                }>
            </CardHeader>
            <CardContent>
                <ol>
                    {(okrs ?? []).map((o, idx) => <li key={idx}>{o.title}</li>)}
                </ol>
            </CardContent>
            <OKRsDialog
                open={showDialog}
                team={entity}
                onChange={onChange}
                onClose={() => setShowDialog(false)} />
        </Card>
    )
}

export { OKRsCard };

