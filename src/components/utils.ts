import { Entity } from "@digitalaidseattle/core";

/**
 *  utils.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
export type EntityProps<T extends Entity> = {
    entity: T;
    onChange: (evt: any) => void;
}

export interface EntityDialogProps<T> {
    entity: T,
    open: boolean,
    handleSuccess: (resp: T | null) => void,
    handleError: (err: Error) => void
}