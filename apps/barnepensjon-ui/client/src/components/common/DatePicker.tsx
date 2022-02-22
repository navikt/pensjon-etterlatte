import { ReactNode, useState } from 'react'
import '@navikt/ds-datepicker/lib/index.css'
import { Datepicker } from '@navikt/ds-datepicker'
import { DatepickerLocales } from '@navikt/ds-datepicker/lib/types'
import { Label } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
import { useLanguageContext } from '../../context/language/LanguageContext'
import { parseISO, format } from 'date-fns'
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
    const [value, setValue] = useState<string | undefined>()
    const { t } = useTranslation('felles')
    const { language } = useLanguageContext()

    // const error: FieldError = get(errors, name)
    // const feilmelding = t(getTransKey(error))

    return (
        <section className={`skjemaelement ${className}`}>
            <Label className="label">{`${label} ${t('datoformat')}`}</Label>

            {description && <div className={'skjemaelement__description'}>{description}</div>}

            <div className="datepicker">
                <Datepicker
                    locale={language as DatepickerLocales}
                    value={value}
                    onChange={(date) => setValue(parseDate(date))}
                    inputId={name}
                    inputProps={{
                        name,
                        placeholder: t('datoEksempel'),
                    }}
                    showYearSelector={true}
                    limitations={{
                        minDate: parseDate(minDate),
                        maxDate: parseDate(maxDate),
                    }}
                />
            </div>

            {/* {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>} */}
        </section>
    )
}

export default DatePicker
