import { Datepicker } from '@navikt/ds-datepicker'
import '@navikt/ds-datepicker/lib/index.css'
import { DatepickerLocales } from '@navikt/ds-datepicker/lib/types'
import { Label } from '@navikt/ds-react'
import { format, parseISO } from 'date-fns'
import { get } from 'lodash'
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema'
import { ReactNode } from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { useLanguageContext } from '../../context/language/LanguageContext'
import useTranslation from '../../hooks/useTranslation'
import { getErrorKey } from '../../utils/errors'
import './Datepicker.css'

interface DatepickerProps {
    name: string
    label: ReactNode
    description?: ReactNode
    minDate?: Date | string
    maxDate?: Date | string
    valgfri?: boolean
    className?: string
}

const parseDate = (dato?: Date | string) => {
    try {
        if (!dato) return undefined
        else if (typeof dato === 'string') return format(parseISO(dato), 'yyyy-MM-dd')
        else return format(parseISO(dato.toISOString()), 'yyyy-MM-dd')
    } catch {
        return undefined
    }
}

const isValid = (date: any): boolean => !!parseDate(date)

const DatePicker = ({ name, label, description, minDate, maxDate, valgfri, className }: DatepickerProps) => {
    const { t } = useTranslation('common')
    const { t: tError } = useTranslation('error')
    const { language } = useLanguageContext()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name)
    const errorMessage = !!error ? tError(getErrorKey(error)) : undefined

    return (
        <section className={`skjemaelement ${className}`}>
            <Label className="label">{`${label} ${t('dateFormat')}`}</Label>

            {description && <div className={'skjemaelement__description'}>{description}</div>}

            <div className="datepicker">
                <Controller
                    name={name}
                    control={control}
                    defaultValue={undefined}
                    rules={{
                        required: !valgfri,
                        validate: (date: any) => !date || isValid(date),
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Datepicker
                            locale={language as DatepickerLocales}
                            value={value}
                            onChange={(date) => onChange(parseDate(date))}
                            inputId={name}
                            inputProps={{
                                name,
                                placeholder: t('dateExample'),
                            }}
                            showYearSelector={true}
                            limitations={{
                                minDate: parseDate(minDate),
                                maxDate: parseDate(maxDate),
                            }}
                        />
                    )}
                />
            </div>

            {errorMessage && <SkjemaelementFeilmelding>{errorMessage}</SkjemaelementFeilmelding>}
        </section>
    )
}

export default DatePicker
