import {Controller, FieldError, FieldPath, FieldValues, useFormContext} from "react-hook-form";
import {
    Checkbox,
    CheckboxGroup,
    CheckboxGroupProps,
    CheckboxProps,
} from "@navikt/ds-react";
import useTranslation from "~hooks/useTranslation";
import React from "react";
import {get} from "lodash";
import {getErrorKey} from "~utils/errors";


interface RHFCheckboksProps extends Omit<CheckboxGroupProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>
    checkbox: CheckboxProps
    required: boolean
}

export function RHFCheckbox({name, checkbox, required, ...rest}: RHFCheckboksProps) {
    const {t} = useTranslation('error')

    const {
        control,
        getValues,
        formState: {errors},
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = !!error ? t(getErrorKey(error)) : undefined

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{required}}
                render={({field: {value, onChange}}) => (
                    <CheckboxGroup {...rest} error={feilmelding} defaultValue={[value]}>
                        <Checkbox
                            key={checkbox.value as string}
                            value={value || false}
                            onChange={(e) => {
                                console.log((e.target as HTMLInputElement).checked)
                                onChange((e.target as HTMLInputElement).checked)
                                console.log(getValues())
                            }}
                        >
                            {checkbox.children}
                        </Checkbox>
                    </CheckboxGroup>
                )}
            />
        </div>
    )
}
