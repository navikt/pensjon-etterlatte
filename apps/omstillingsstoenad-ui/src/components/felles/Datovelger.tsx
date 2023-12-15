import { ReactNode } from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { parseISO, format, addYears } from 'date-fns'
import { get } from 'lodash'
import { getTransKey } from '../../utils/translation'
import styled from 'styled-components'
import { DatePicker, DatePickerProps, useDatepicker } from '@navikt/ds-react'

interface StyledProps {
    $kol: boolean
}

const DatovelgerSection = styled.section<StyledProps>`
    margin-bottom: 0 !important;

    ${(props) => (props.$kol ? 'flex-grow: 1; flex-basis: auto;' : '')}
`

interface DatovelgerProps {
    name: FieldPath<any>
    label: ReactNode
    description?: ReactNode
    minDate?: Date
    maxDate?: Date
    valgfri?: boolean
    className?: string
    kol?: boolean
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

const parseDateMaxMin = (dato: Date | string) => {
    if (typeof dato === 'string') return parseISO(dato)
    else return parseISO(dato.toISOString())
}

const isValid = (date: any): boolean => !!parseDate(date)

const Datovelger = ({
    name,
    label,
    description,
    minDate = new Date('01-01-1920'),
    maxDate = new Date(addYears(new Date(), 20)),
    valgfri,
    kol = false,
}: DatovelgerProps) => {
    const { t, i18n } = useTranslation()
    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = t(getTransKey(error))

    const descriptionMedOppgiDato = description
        ? `${description} ${t('felles.datoformat')}`
        : `${t('felles.oppgiDato')} ${t('felles.datoformat')}`

    return (
        <DatovelgerSection $kol={kol}>
            <div className="datepicker">
                <Controller
                    name={name}
                    control={control}
                    defaultValue={undefined}
                    rules={{
                        required: !valgfri,
                        validate: (date) => !date || isValid(date),
                    }}
                    render={({ field: { onChange, value } }) => {
                        const { datepickerProps, inputProps } = useDatepicker({
                            fromDate: minDate ? parseDateMaxMin(minDate) : undefined,
                            toDate: maxDate ? parseDateMaxMin(maxDate) : undefined,
                            locale: i18n.language as DatePickerProps['locale'],
                            inputFormat: 'dd.MM.yyyy',
                            defaultSelected: value ? new Date(value) : undefined,
                            onDateChange: (date) => onChange(date),
                        })
                        return (
                            <DatePicker {...datepickerProps} dropdownCaption>
                                <DatePicker.Input
                                    id={name}
                                    {...inputProps}
                                    label={valgfri ? `${label} (${t('felles.valgfri')})` : label}
                                    error={feilmelding}
                                    description={descriptionMedOppgiDato}
                                />
                            </DatePicker>
                        )
                    }}
                />
            </div>
        </DatovelgerSection>
    )
}

export default Datovelger
