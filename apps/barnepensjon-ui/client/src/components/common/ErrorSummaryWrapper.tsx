import { FieldError, FieldErrors } from 'react-hook-form/dist/types/errors'
import { v4 as uuid } from 'uuid'
import { ErrorSummary } from '@navikt/ds-react'
import FormGroup from './FormGroup'
import useTranslation, { TFunction } from '../../hooks/useTranslation'
import { getErrorKey } from '../../utils/errors'

interface Error {
    elementId: string
    message: string
}

const getFieldErrors = (obj: FieldErrors): FieldError[] => {
    return Object.values(obj).flatMap((value?: any) => {
        if (!value) return undefined
        if ((value as FieldError)?.type && typeof value.type !== 'object') return value
        else return getFieldErrors(value)
    })
}

const convert = (errors: FieldErrors, t: TFunction): Error[] => {
    return getFieldErrors(errors)
        .filter((error) => !!error)
        .map((error) => {
            return {
                elementId: error.ref!!.name,
                message: t(getErrorKey(error)),
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
                        {convert(errors, t).map((feil) => (
                            <ErrorSummary.Item key={feil.elementId} href={`#${feil.elementId}`}>
                                {feil.message}
                            </ErrorSummary.Item>
                        ))}
                    </ErrorSummary>
                </FormGroup>
            )}
        </>
    )
}
