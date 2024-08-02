import { FieldError } from 'react-hook-form'

export function getErrorKey(error?: FieldError) {
    if (!error) return ''
    if (Array.isArray(error)) error = error['root']

    const name = (error as FieldError).ref?.name?.replace(/\[\d]/, '')

    return `${name}.${error?.type}`
}
