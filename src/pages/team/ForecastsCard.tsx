/**
 *  ForecastsCard.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EntityProps } from "../../components/utils";
import { Forecast, Team } from "../../services/dasTeamService";
import ForecastsDialog from "./ForecastsDialog";

const ForecastsCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
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
                titleTypographyProps={{ fontSize: 24 }}
                title='Forecasts'
                subheader='Current forecasts.  Click Edit to manage forecasts.'
                action={
                    <Button onClick={() => setShowDialog(true)}>Edit</Button>
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
