/**
 *  ForecastsCard.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Card, CardContent, CardHeader, Rating, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EntityProps } from "../../components/utils";
import { Forecast, forecastService, Team } from "../../services/dasTeamService";
import { CARD_HEADER_SX } from "./utils";

const ForecastsCard: React.FC<EntityProps<Team>> = ({ entity, onChange }) => {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);

    useEffect(() => {
        if (entity) {
            const today = dayjs();
            setForecasts((entity.forecast ?? [])
                .filter(f => dayjs(f.end_date).isAfter(today)));
        }
    }, [entity]);

    function handlePerformanceChange(forecast: Forecast, value: number): void {
        forecastService.update(forecast.id!, { performance: value })
            .then(updated => onChange(updated));
    }

    return (
        <Card>
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                titleTypographyProps={{ fontSize: 24 }}
                title={"Forecasts" + `${entity ? ": " + entity.name : ''}`}
                subheader='Current forecasts.'
            >
            </CardHeader>
            <CardContent>
                {forecasts.length === 0 && <Typography>No current forecasts.</Typography>}
                <Table>
                    <TableBody>
                        {(forecasts).map((f, idx) =>
                        (<TableRow key={idx}>
                            <TableCell>{f.description}</TableCell>
                            <TableCell width={100}><Rating value={f.performance}
                                onChange={(evt: any) => handlePerformanceChange(f, evt.target.value)} /></TableCell>
                        </TableRow>)
                        )}
                    </TableBody>
                </Table>
            </CardContent>

        </Card>
    )
}

export { ForecastsCard };
