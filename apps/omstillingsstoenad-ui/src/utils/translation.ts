import { FieldError } from 'react-hook-form'

/**
 * Enkel funksjon for å fjerne firkantparentes fra error name
 */
export const getTransKey = (error?: FieldError): string => {
    if (!error) return ''

    const name = error.ref?.name?.replace(/\[\d]/, '')

    return `feil.${name}.${error.type}`
}
