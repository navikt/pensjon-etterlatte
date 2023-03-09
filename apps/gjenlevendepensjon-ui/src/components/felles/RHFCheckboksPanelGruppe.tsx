import { Controller, FieldError, FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { CheckboxGroup, Checkbox, CheckboxProps, CheckboxGroupProps } from '@navikt/ds-react'
import styled from 'styled-components'
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { getTransKey } from "../../utils/translation";

const CheckboxGroupWrapper = styled(CheckboxGroup)<{inline?: boolean}>`
    .navds-checkboxes {
        ${props => props.inline 
        ? "display: flex; gap: 1rem;"
        : ''
        }
    }
`

const handleSelect = (array: any[], addOrRemove: any) => {
    return array?.includes(addOrRemove)
        ? array?.filter(value => value !== addOrRemove)
        : [...(array ?? []), addOrRemove];
}

interface RHFCheckboksGruppeProps extends Omit<CheckboxGroupProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>;
    checkboxes: CheckboxProps[];
    required?: boolean;
    inline?: boolean;
}

export const RHFCheckboksGruppe = ({ name, checkboxes, required = true, inline = false, ...rest }: RHFCheckboksGruppeProps) => {
    const { t } = useTranslation();

    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required }}
                render={({ field: { value, onChange } }) => (
                    <CheckboxGroupWrapper
                        {...rest}
                        error={feilmelding}
                        defaultValue={value}
                        inline={inline ? true : undefined}
                    >
                        {checkboxes.map((checkbox: CheckboxProps) => (
                            <Checkbox
                                key={checkbox.value as string}
                                value={checkbox.value || ''}
                                required={checkbox.required}
                                onChange={(e) =>
                                        onChange(handleSelect(value, (e.target as HTMLInputElement).value as any))
                                }
                            >
                                {checkbox.children}
                            </Checkbox>
                        ))}
                    </CheckboxGroupWrapper>
                )}
            />
        </div>
    )
};
