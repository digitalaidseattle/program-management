/**
 *  ReadOnlyForm.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import React, { ReactNode, useEffect, useState } from 'react';

import { InputOption } from '@digitalaidseattle/mui';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FieldRow } from './FieldRow';

interface ReadOnlyFormProps<T> {
    entity: T;
    inputFields: InputOption[]
}

const ReadOnlyForm: React.FC<ReadOnlyFormProps<any>> = <T,>({ entity, inputFields }: ReadOnlyFormProps<T>) => {

    const [inputs, setInputs] = useState<ReactNode[]>([]);

    useEffect(() => {
        if (entity && inputFields.length > 0) {
            setInputs(inputFields.map((input, idx) => inputField(idx, input, (entity as any)[input.name])));
        }
    }, [inputFields, entity]);

    const inputField = (idx: number, option: InputOption, value: any) => {
        switch (option.type) {
            case 'custom':
                return option.inputRenderer!(idx, option, value)
            case 'date':
                return (
                    <FieldRow label={option.label}>
                        <Typography>{dayjs(value).format("MMM DD, YYYY")}</Typography>
                    </FieldRow>
                );
            case 'time':
                return (
                    <FieldRow label={option.label}>
                        <Typography>{dayjs(value).format("hh:mm")}</Typography>
                    </FieldRow>
                );
            case 'datetime':
                return (
                    <FieldRow label={option.label}>
                        <Typography>{dayjs(value).format("MMM DD, YYYY hh:mm a")}</Typography>
                    </FieldRow>
                );
            case 'select': {
                const opt = option.options!
                    .find((item: { label: string, value: string }) =>
                        item.value === value);
                return (
                    <FieldRow label={option.label}>
                        <Typography>{opt?.label}</Typography>
                    </FieldRow>
                )
            }
            case 'rating':   // TODO
            case 'debounce':
            case 'string':
            default:
                return (
                    <FieldRow label={option.label}>
                        <Typography>{value}</Typography>
                    </FieldRow>
                );
        }
    }

    return (
        <Stack gap={2}>
            {inputs}
        </Stack>
    )
}
export { ReadOnlyForm };

