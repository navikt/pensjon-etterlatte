import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { MonthPicker, MonthValidationT, useMonthpicker } from '@navikt/ds-react'
import { format } from 'date-fns'
import { useSpraak } from '../spraak/SpraakContext.tsx'
import { Spraak } from '../spraak/spraak.ts'
import { ReactNode, useState } from 'react'

const formatDateToLocaleDateOrEmptyString = (date: Date | undefined) =>
    date === undefined ? '' : format(date, 'yyyy-MM-dd')

const spraakTilAkselLocale = (spraak: Spraak): 'nb' | 'nn' | 'en' | undefined => {
    switch (spraak) {
        case Spraak.BOKMAAL:
            return 'nb'
        case Spraak.NYNORSK:
            return 'nn'
        case Spraak.ENGELSK:
            return 'en'
        default:
            return undefined
    }
}

interface Props<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label: ReactNode | string
    description?: ReactNode | string
    errorVedTomInput?: string
    fromDate?: Date
    toDate?: Date
}

export const ControlledMaanedVelger = <T extends FieldValues>({
    name,
    control,
    label,
    description,
    errorVedTomInput,
    fromDate,
    toDate,
}: Props<T>) => {
    const spraak = useSpraak()

    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: { required: errorVedTomInput ? { value: true, message: errorVedTomInput } : undefined },
    })

    const [, setDateError] = useState<MonthValidationT | undefined>(undefined)

    const { monthpickerProps, inputProps } = useMonthpicker({
        onMonthChange: (date) => date && field.onChange(formatDateToLocaleDateOrEmptyString(date)),
        defaultSelected: field.value ? new Date(field.value) : undefined,
        fromDate: fromDate ?? undefined,
        toDate: toDate ?? undefined,
        defaultYear: fromDate,
        locale: spraakTilAkselLocale(spraak),
        onValidate: (val) => {
            if (val.isEmpty) field.onChange(undefined)
            else setDateError(val)
        },
    })

    return (
        <MonthPicker {...monthpickerProps}>
            <MonthPicker.Input
                {...inputProps}
                id={field.name}
                label={label}
                description={description}
                error={error?.message}
            />
        </MonthPicker>
    )
}
