import { Entity } from "@digitalaidseattle/core";

/**
 *  utils.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
export type EntityProps<T extends Entity> = {
    entity: T;
    onChange: (evt: any) => void;
}

export type EntityCardProps<T extends Entity> = {
    entity: T
    cardStyles?: any
}

export interface EntityDialogProps<T> {
    entity: T,
    open: boolean,
    handleSuccess: (resp: T | null) => void,
    handleError: (err: Error) => void
}
