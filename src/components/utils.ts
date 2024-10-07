/**
 *  utils.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
interface EntityDialogProps<T> {
    entity: T,
    open: boolean,
    handleSuccess: (resp: T | null) => void,
    handleError: (err: Error) => void
}