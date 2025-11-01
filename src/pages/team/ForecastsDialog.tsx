/**
 *  ForecastsDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { InputOption } from '@digitalaidseattle/mui';
import dayjs from 'dayjs';
import { Forecast, forecastService, Team } from '../../services/dasTeamService';
import ElementsDialog from './ElementsDialog';

interface ForecastsDialogProps {
    open: boolean;
    team: Team;
    onChange: (evt: any) => void;
    onClose: () => void;
}
function ForecastsDialog({ open, team, onChange, onClose }: ForecastsDialogProps) {

    const [elements, setElements] = useState<Forecast[]>([]);

    useEffect(() => {
        if (team) {
            console.log(team.forecast)
            setElements((team.forecast ?? [])
                .sort((a, b) => dayjs(b.end_date).second() - dayjs(a.end_date).second()));
        }
    }, [team]);

    const columns: GridColDef<Forecast[][number]>[] = [
        {
            field: 'description',
            headerName: 'Description',
            width: 200
        },
        {
            field: 'end_date',
            headerName: 'End Date'
        }
    ]

    const inputFields: InputOption[] = [
        {
            label: 'Description',
            name: 'description',
            type: 'string',
            disabled: false
        },
        {
            name: 'start_date',
            label: 'Start Date',
            type: 'date',
            disabled: false
        },
        {
            name: 'end_date',
            label: 'End Date',
            type: 'date',
            disabled: false
        },
        {
            name: 'performance',
            label: 'Performance',
            type: 'rating',
            disabled: false,
        }
    ]

    const handleSave = (element: Forecast, isNew: boolean) => {
        if (element) {
            if (isNew) {
                forecastService.insert(element)
                    .then(inserted => onChange(inserted))
            } else {
                forecastService.update(element.id as string, element)
                    .then(updated => onChange(updated));
            }
        }
    }

    return (
        <ElementsDialog
            open={open}
            elements={elements}
            displayOptions={{
                columns: columns,
                inputFields: inputFields,
                dialogTitle: `Forecasts for ${team.name}`,
                typeName: 'Forecast',
                pluralName: 'Forecasts'
            }}
            newFunction={() => forecastService.empty(team)}
            onSave={handleSave}
            onClose={() => onClose()} />
    )
}
export default ForecastsDialog;


