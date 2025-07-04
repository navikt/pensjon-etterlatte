import { MonthPicker, MonthPickerProps, MonthValidationT, useMonthpicker } from '@navikt/ds-react'
import { addYears, format } from 'date-fns'
import { get } from 'lodash'
import { ReactNode, useState } from 'react'
import { Controller, FieldError, FieldValues, Path, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getTransKey } from '~utils/translation'

interface Props<T extends FieldValues> {
    name: Path<T>
    label: ReactNode | string
    description?: ReactNode | string
    fromDate?: Date
    toDate?: Date
    valgfri?: boolean
}

export const Maanedvelger = <T extends FieldValues>({
    name,
    label,
    description,
    fromDate = new Date(1920, 0, 1),
    toDate = new Date(addYears(new Date(), 20)),
    valgfri,
}: Props<T>) => {
    const { t, i18n } = useTranslation()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = t(getTransKey(error))

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={undefined}
            rules={{
                required: !valgfri,
                // TODO: se på den stygge her
                validate: (date) => (!date || false ? '' : format(date, 'yyyy-MM-dd')),
            }}
            render={({ field: { onChange, value } }) => {
                const { monthpickerProps, inputProps } = useMonthpicker({
                    onMonthChange: (date) => date && onChange(format(date, 'yyyy-MM-dd')),
                    defaultSelected: value ? new Date(value) : undefined,
                    fromDate: fromDate ?? undefined,
                    toDate: toDate ?? undefined,
                    defaultYear: new Date(),
                    locale: i18n.language as MonthPickerProps['locale'],
                })

                return (
                    <MonthPicker {...monthpickerProps}>
                        <MonthPicker.Input
                            {...inputProps}
                            id={name}
                            label={label}
                            description={description}
                            error={feilmelding}
                        />
                    </MonthPicker>
                )
            }}
        />
    )
}
