
// material-ui
import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    IconButton
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { EntityProps } from '../../components/utils';
import { OKR, Team } from '../../services/dasTeamService';
import OKRsDialog from './OKRsDialog';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }

type OKRCardProps = EntityProps<Team> & {
    editable?: boolean
}

const OKRsCard: React.FC<OKRCardProps> = ({ entity, onChange, editable = false }) => {
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
                title='OKRs'
                subheader={`Current OKRs${editable ? ', edit to see all' : ''}`}
                action={editable &&
                    <IconButton size={"small"} onClick={() => setShowDialog(true)}><EditOutlined /></IconButton>
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

