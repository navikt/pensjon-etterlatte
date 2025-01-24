import { FieldErrors, FieldValues } from 'react-hook-form'
import { useSpraak } from '../spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { SammendragAvSkjemaFeil as SammendragAvSkjemaFeilInnhold } from '../sanity.types.ts'
import { KomponentLaster } from '../KomponentLaster.tsx'
import { ErrorSummary } from '@navikt/ds-react'
import { formaterFieldErrors } from './skjemaError.ts'

interface Props<T extends FieldValues> {
    errors: FieldErrors<T>
}

export const SammendragAvSkjemaFeil = <T extends FieldValues>({ errors }: Props<T>) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<SammendragAvSkjemaFeilInnhold>(
        '*[_type == "sammendragAvSkjemaFeil"]'
    )

    if (isLoading) {
        return <KomponentLaster />
    }
    if (error) {
        throw error
    }

    return (
        !!Object.keys(errors)?.length && (
            <ErrorSummary heading={innhold?.tittel?.[spraak]}>
                {formaterFieldErrors(errors).map((error) => (
                    <ErrorSummary.Item key={error.name} href={`#${error.name}`}>
                        {error.message}
                    </ErrorSummary.Item>
                ))}
            </ErrorSummary>
        )
    )
}
