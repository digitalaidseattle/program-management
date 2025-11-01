/**
 *  ForecastsDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { InputOption } from '@digitalaidseattle/mui';
import { OKR, okrService, Team } from '../../services/dasTeamService';
import ElementsDialog from './ElementsDialog';

interface OKRsDialogProps {
    open: boolean;
    team: Team;
    onChange: (evt: any) => void;
    onClose: () => void;
}

function OKRsDialog({ open, team, onChange, onClose }: OKRsDialogProps) {

    const [elements, setElements] = useState<OKR[]>([]);

    useEffect(() => {
        if (team) {
            setElements((team.okr ?? [])
                .sort((a, b) => dayjs(b.end_date).second() - dayjs(a.end_date).second()));
        }
    }, [team]);

    const columns: GridColDef<OKR[][number]>[] = [
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
            name: 'health_rating',
            label: 'Health',
            type: 'rating',
            disabled: false,
        }
    ]

    const handleSave = (element: OKR, isNew: boolean) => {
        if (element) {
            if (isNew) {
                okrService.insert(element)
                    .then(inserted => onChange(inserted))
            } else {
                okrService.update(element.id as string, element)
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
                dialogTitle: `OKRs for ${team.name}`,
                typeName: 'OKR',
                pluralName: 'OKRs'
            }}
            newFunction={() => okrService.empty(team)}
            onSave={handleSave}
            onClose={() => onClose()} />
    )
}
export default OKRsDialog;


