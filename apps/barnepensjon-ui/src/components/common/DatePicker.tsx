import { Datepicker } from '@navikt/ds-datepicker'
import '@navikt/ds-datepicker/lib/index.css'
import { DatepickerLocales } from '@navikt/ds-datepicker/lib/types'
import { Label } from '@navikt/ds-react'
import { format, parseISO } from 'date-fns'
import { get } from 'lodash'
import { ReactNode } from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { useLanguageContext } from '../../context/language/LanguageContext'
import useTranslation from '../../hooks/useTranslation'
import { getErrorKey } from '../../utils/errors'

interface DatePickerProps {
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

const DatePicker = ({
    name,
    label,
    description,
    minDate = new Date('01-01-1900'),
    maxDate = new Date(),
    valgfri,
    className,
}: DatePickerProps) => {
    const { t } = useTranslation('common')
    const { language } = useLanguageContext()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const errorMessage = !!error ? t(getErrorKey(error), { ns: 'error' }) : undefined

    return (
        <section className={`skjemaelement ${className}`}>
            <Label className="label">{label}</Label>

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
                            id={name}
                            showYearSelector={true}
                            locale={language as DatepickerLocales}
                            value={value}
                            onChange={(date) => onChange(parseDate(date))}
                            inputName={name}
                            label={`${t('dateSRLabel')} ${t('dateFormat')} ${valgfri ? `(${t('optional')})` : ''}`}
                            error={errorMessage}
                            limitations={{
                                minDate: parseDate(minDate),
                                maxDate: parseDate(maxDate),
                            }}
                        />
                    )}
                />
            </div>
        </section>
    )
}

export default DatePicker
