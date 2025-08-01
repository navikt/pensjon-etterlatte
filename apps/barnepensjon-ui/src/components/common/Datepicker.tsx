import { DatePicker, DatePickerProps, useDatepicker } from '@navikt/ds-react'
import { format, parseISO } from 'date-fns'
import { get } from 'lodash'
import { ReactNode } from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { useLanguageContext } from '../../context/language/LanguageContext'
import useTranslation from '../../hooks/useTranslation'
import { getErrorKey } from '../../utils/errors'

interface DatepickerProps {
    name: string
    label: ReactNode
    description?: ReactNode
    minDate?: Date | string
    maxDate?: Date | string
    valgfri?: boolean
}

const formatDate = (dato?: Date | string) => {
    try {
        if (!dato) return undefined
        else if (typeof dato === 'string') return format(parseISO(dato), 'yyyy-MM-dd')
        else return format(parseISO(dato.toISOString()), 'yyyy-MM-dd')
    } catch {
        return undefined
    }
}

const parseDateMaxMin = (dato: Date | string) => {
    if (typeof dato === 'string') return parseISO(dato)
    else return parseISO(dato.toISOString())
}

const isValid = (date: Date | string): boolean => !!formatDate(date)

const Datepicker = ({
    name,
    label,
    description,
    minDate = new Date(1900, 0, 1),
    maxDate = new Date(),
    valgfri,
}: DatepickerProps) => {
    const { t } = useTranslation('common')
    const { language } = useLanguageContext()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const errorMessage = !!error ? t(getErrorKey(error), { ns: 'error' }) : undefined

    const labelWithOptional = `${label} ${valgfri ? `(${t('optional')})` : ''}`
    const descriptionWithFormat = description
        ? `${description} ${t('dateFormat')}`
        : `${t('dateSRLabel')} ${t('dateFormat')}`

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={undefined}
            rules={{
                required: !valgfri,
                validate: (date: Date | string) => !date || isValid(date),
            }}
            render={({ field: { onChange, value } }) => {
                const { datepickerProps, inputProps } = useDatepicker({
                    fromDate: minDate ? parseDateMaxMin(minDate) : undefined,
                    toDate: maxDate ? parseDateMaxMin(maxDate) : undefined,
                    locale: language as DatePickerProps['locale'],
                    inputFormat: 'dd.MM.yyyy',
                    defaultSelected: value ? new Date(value) : undefined,
                    onDateChange: (date) => onChange(formatDate(date)),
                })
                return (
                    <DatePicker {...datepickerProps} dropdownCaption>
                        <DatePicker.Input
                            id={name}
                            {...inputProps}
                            label={labelWithOptional}
                            error={errorMessage}
                            description={descriptionWithFormat}
                        />
                    </DatePicker>
                )
            }}
        />
    )
}

export default Datepicker
