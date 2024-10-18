import { FieldError, FieldErrors } from 'react-hook-form'

interface Error {
    name: string
    message: string
}

const fieldErrorsSomListe = (errors: FieldErrors): Array<FieldError> => {
    return Object.values(errors).flatMap((value?: unknown) => {
        if (!value) {
            return []
        }

        const kanskjeFieldError = value as FieldError

        if (kanskjeFieldError?.type && typeof kanskjeFieldError.type !== 'object') {
            return kanskjeFieldError
        } else if (value as FieldErrors) {
            return fieldErrorsSomListe(value)
        } else {
            return []
        }
    })
}

export const formaterFieldErrors = (errors: FieldErrors): Array<Error> => {
    return fieldErrorsSomListe(errors)
        .filter((error) => !!error)
        .map((error) => ({ name: error.ref!.name, message: error.message! }))
}
