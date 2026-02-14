/**
 *  VentureReportDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { DialogProps } from '@mui/material';

import { UserContext } from '@digitalaidseattle/core';
import { InputFormDialog, InputOption } from '@digitalaidseattle/mui';
import React, { useContext, useEffect, useState } from 'react';
import { VentureReport } from '../services/dasVentureReportService';
import { Venture, ventureService } from '../services/dasVentureService';

// material-ui

interface VentureReportDialogProps extends DialogProps {
    title: string;
    report: VentureReport;
    onClose: (evt: { report: VentureReport | null | undefined }) => void;
}

const VentureReportDialog: React.FC<VentureReportDialogProps> = ({ title, report: initial, open, onClose }) => {

    const { user } = useContext(UserContext);
    const [ventures, setVentures] = useState<Venture[]>([]);
    const [inputFields, setInputFields] = useState<InputOption[]>([]);
    const [report, setReport] = useState<VentureReport>();

    useEffect(() => {
        ventureService.getActive()
            .then(v => setVentures(v));
    }, []);

    useEffect(() => {
        setReport(initial)
    }, [initial]);

    useEffect(() => {
        if (ventures.length > 0) {
            setInputFields(createInputFields());
        }
    }, [ventures]);

    useEffect(() => {
        if (user && initial) {
            setReport({
                ...initial,
                reported_by: (initial.reported_by.trim() !== '') ? initial.reported_by : user.email
            });
        }
    }, [initial, user]);

    function createInputFields(): InputOption[] {
        return [
            {
                name: 'reported_by',
                label: 'Reported By',
                disabled: true
            },
            {
                name: 'reporting_date',
                label: 'Reporting Date',
                type: 'date',
                disabled: true
            },
            {
                name: 'venture_id',
                label: 'Venture',
                type: 'select',
                disabled: false,
                options: ventures.map(v => ({ value: v.id, label: v.venture_code }))
            },
            {
                name: 'health',
                label: 'Health',
                type: 'select',
                disabled: false,
                options: [
                    { value: 'on_track', label: 'On Track' },
                    { value: 'at_risk', label: 'At Risk' },
                    { value: 'blocked', label: 'Blocked' },
                ]
            },
            {
                name: 'phase',
                label: 'Phase',
                type: 'select',
                disabled: false,
                options: [
                    { value: 'discovery', label: 'Discovery' },
                    { value: 'build', label: 'Build' },
                    { value: 'pilot', label: 'Pilot' },
                    { value: 'live', label: 'Live' },
                    { value: 'scaling', label: 'Scaling' },
                ]
            },
            {
                name: 'successes',
                label: 'Successes',
                size: 2,
                disabled: false
            },
            {
                name: 'challenges',
                label: 'Challenges/Problems',
                size: 2,
                disabled: false
            },
            {
                name: 'changes_by_partner',
                label: 'Changes by Partner',
                size: 2,
                disabled: false
            },
            {
                name: 'staffing_need',
                label: 'Staffing Needs',
                size: 2,
                disabled: false
            },
            {
                name: 'asks',
                label: 'Any other comments',
                size: 2,
                disabled: false
            },
            {
                name: 'next_steps',
                label: 'Next Steps',
                size: 2,
                disabled: false
            },
        ]
    }

    function handleChange(changed: VentureReport | null) {
        onClose({ report: changed })
    }

    return (
        <InputFormDialog
            open={open && report !== undefined}
            title={title}
            inputFields={inputFields}
            entity={report!}
            onChange={handleChange}
        />
    )
}
export default VentureReportDialog;
