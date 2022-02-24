import { FieldError } from 'react-hook-form'

export function getErrorKey(error?: FieldError) {
    if (!error) return ''

    const name = error.ref?.name?.replace(/\[\d]/, '')

    return `error.${name}.${error.type}`
}
