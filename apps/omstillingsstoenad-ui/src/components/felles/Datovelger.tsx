import { ReactNode } from 'react'
import '@navikt/ds-datepicker/lib/index.css'
import { Datepicker } from '@navikt/ds-datepicker'
import { DatepickerLocales } from '@navikt/ds-datepicker/lib/types'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { parseISO, format, addYears } from 'date-fns'
import { get } from 'lodash'
import { getTransKey } from '../../utils/translation'
import { Label } from '@navikt/ds-react'
import styled from 'styled-components'

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
    minDate?: Date | string
    maxDate?: Date | string
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

    return (
        <DatovelgerSection $kol={kol}>
            <Label htmlFor={name}>{label}</Label>

            {description ? (
                <div className={'skjemaelement__description'}>{`${description} (${t('felles.datoformat')})`}</div>
            ) : (
                <div className={'skjemaelement__description'}>{t('felles.datoformat')}</div>
            )}

            <div className="datepicker">
                <Controller
                    name={name}
                    control={control}
                    defaultValue={undefined}
                    rules={{
                        required: !valgfri,
                        validate: (date) => !date || isValid(date),
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Datepicker
                            id={name}
                            showYearSelector={true}
                            locale={i18n.language as DatepickerLocales}
                            value={value}
                            onChange={(date) => onChange(parseDate(date))}
                            inputName={name}
                            label={''}
                            error={feilmelding}
                            limitations={{
                                minDate: parseDate(minDate),
                                maxDate: parseDate(maxDate),
                            }}
                        />
                    )}
                />
            </div>
        </DatovelgerSection>
    )
}

export default Datovelger
