import { FieldError, FieldErrors } from 'react-hook-form/dist/types/errors'
import { v4 as uuid } from 'uuid'
import { ErrorSummary } from '@navikt/ds-react'
import FormGroup from './FormGroup'
import useTranslation, { TFunction } from '../../hooks/useTranslation'
import { getErrorKey } from '../../utils/errors'

interface Feil {
    skjemaelementId: string
    feilmelding: string
}

const getFieldErrors = (obj: FieldErrors): FieldError[] => {
    return Object.values(obj).flatMap((value?: any) => {
        if (!value) return undefined
        if ((value as FieldError)?.type && typeof value.type !== 'object') return value
        else return getFieldErrors(value)
    })
}

const konverterFeilmeldinger = (errors: FieldErrors, t: TFunction): Feil[] => {
    return getFieldErrors(errors)
        .filter((error) => !!error)
        .map((error) => {
            return {
                skjemaelementId: error.ref!!.name,
                feilmelding: t(getErrorKey(error)),
            }
        })
}

export default function ErrorSummaryWrapper({ errors }: { errors: FieldErrors }) {
    const { t } = useTranslation('error')

    return (
        <>
            {!!Object.keys(errors).length && (
                <FormGroup key={uuid()}>
                    <ErrorSummary heading={t('tittel')}>
                        {konverterFeilmeldinger(errors, t).map((feil) => (
                            <ErrorSummary.Item key={feil.skjemaelementId} href={`#${feil.skjemaelementId}`}>
                                {feil.feilmelding}
                            </ErrorSummary.Item>
                        ))}
                    </ErrorSummary>
                </FormGroup>
            )}
        </>
    )
}
