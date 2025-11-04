/**
 *  utils.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import dayjs from "dayjs";

export type EntityProps<T> = {
    entity: T;
    onChange: (evt: any) => void;
}

export type EntityCardProps<T> = {
    entity: T
    cardStyles?: any
}

export interface EntityDialogProps<T> {
    entity: T,
    open: boolean,
    handleSuccess: (resp: T | null) => void,
    handleError: (err: Error) => void
}

export function dateToString(date: Date) {
    return dayjs(date).format('MM/DD/YYYY');
}
