import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Box, TextField } from '@navikt/ds-react'
import { Spraak } from '../spraak/spraak.ts'

interface Props<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    spraak: Spraak
    label?: string
    description?: string
}

export const ControlledInntektTextField = <T extends FieldValues>({
    name,
    control,
    spraak,
    label,
    description,
}: Props<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <Box maxWidth="20rem">
                    <TextField
                        label={label}
                        description={description}
                        value={value}
                        // Fjerne alt som ikke er tall og gjøre om til Number
                        onChange={(e) =>
                            onChange(
                                new Intl.NumberFormat(spraak.toLowerCase()).format(
                                    Number(e.target.value.replace(/[^0-9.]/g, ''))
                                )
                            )
                        }
                        inputMode="numeric"
                    />
                </Box>
            )}
        />
    )
}
