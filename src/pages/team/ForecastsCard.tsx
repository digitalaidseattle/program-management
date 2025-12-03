/**
 *  ForecastsCard.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { EditOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { EntityProps } from "../../components/utils";
import { Forecast, Team } from "../../services/dasTeamService";
import ForecastsDialog from "./ForecastsDialog";

type ForecastsCardProps = EntityProps<Team> & {
    editable?: boolean
}

const ForecastsCard: React.FC<ForecastsCardProps> = ({ entity, onChange, editable = false }) => {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        if (entity) {
            const today = dayjs();
            setForecasts((entity.forecast ?? [])
                .filter(f => dayjs(f.end_date).isAfter(today)));
        }
    }, [entity]);

    return (
        <Card>
            <CardHeader
                title='Forecasts'
                subheader={`Current forecasts${editable ? ', edit to see all' : ''}`}
                action={editable &&
                    <IconButton size={"small"} onClick={() => setShowDialog(true)}><EditOutlined /></IconButton>
                }>
            </CardHeader>
            <CardContent>
                <ol>
                    {(forecasts).map((f, idx) => <li key={idx}>{f.description}</li>)}
                </ol>
            </CardContent>
            <ForecastsDialog
                open={showDialog}
                team={entity}
                onChange={onChange}
                onClose={() => setShowDialog(false)} />
        </Card>
    )
}

export { ForecastsCard };
