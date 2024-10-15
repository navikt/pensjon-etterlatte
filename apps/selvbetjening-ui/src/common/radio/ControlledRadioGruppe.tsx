import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { ReactNode } from 'react'
import { RadioGroup } from '@navikt/ds-react'

interface Props<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    legend: ReactNode | string
    radios: ReactNode | Array<ReactNode>
    description?: ReactNode | string
    errorVedTomInput?: string
}

export const ControlledRadioGruppe = <T extends FieldValues>({
    name,
    control,
    legend,
    radios,
    description,
    errorVedTomInput,
}: Props<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: errorVedTomInput
                    ? {
                          value: true,
                          message: errorVedTomInput,
                      }
                    : undefined,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <RadioGroup
                    onChange={onChange}
                    value={value}
                    error={error?.message}
                    legend={legend}
                    description={description}
                >
                    {radios}
                </RadioGroup>
            )}
        />
    )
}
