
/**
 *  utils.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
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
