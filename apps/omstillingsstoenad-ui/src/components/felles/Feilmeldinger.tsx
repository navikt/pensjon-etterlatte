import { Box, ErrorSummary } from '@navikt/ds-react'
import { TFunction } from 'i18next'
import { FieldError, FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { getTransKey } from '../../utils/translation'

interface Feil {
    skjemaelementId: string
    feilmelding: string
}

const getFieldErrors = (obj: FieldErrors): FieldError[] => {
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    return Object.values(obj).flatMap((value?: any) => {
        if (!value) return undefined
        if ((value as FieldError)?.type && typeof value.type !== 'object') return value
        else return getFieldErrors(value)
    })
}

export const konverterFeilmeldinger = (errors: FieldErrors, t: TFunction<'translation'>): Feil[] => {
    return getFieldErrors(errors)
        .filter((error) => !!error)
        .map((error) => {
            return {
                skjemaelementId: error.ref!.name,
                feilmelding: t(getTransKey(error)),
            }
        })
}

const Feilmeldinger = ({ errors }: { errors: FieldErrors }) => {
    const { t } = useTranslation()

    return (
        <>
            {!!Object.keys(errors).length && (
                <Box marginBlock="0 12" key={uuid()}>
                    <ErrorSummary heading={t('feil.tittel')}>
                        {konverterFeilmeldinger(errors, t).map((feil) => (
                            <ErrorSummary.Item key={feil.skjemaelementId} href={`#${feil.skjemaelementId}`}>
                                {feil.feilmelding}
                            </ErrorSummary.Item>
                        ))}
                    </ErrorSummary>
                </Box>
            )}
        </>
    )
}

export default Feilmeldinger
