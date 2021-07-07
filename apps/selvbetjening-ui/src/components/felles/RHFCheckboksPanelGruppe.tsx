import { FieldError, useFormContext } from "react-hook-form";
import {
    Checkbox,
    CheckboxGruppe,
    SkjemaGruppe,
    SkjemaGruppeProps, CheckboksPanel
} from "nav-frontend-skjema";
import { Controller, FieldPath, FieldValues } from "react-hook-form";
import { CheckboxProps } from "nav-frontend-skjema/lib/checkbox";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { getTransKey } from "../../utils/Utils";

const handleSelect = (array: any[], addOrRemove: any) => {
    return array?.includes(addOrRemove)
        ? array?.filter(value => value !== addOrRemove)
        : [...(array ?? []), addOrRemove];
}

interface RHFCheckboksPanelGruppeProps extends Omit<SkjemaGruppeProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>;
    checkboxes: CheckboxProps[];
}

export const RHFCheckboksPanelGruppe = ({ name, checkboxes, ...rest }: RHFCheckboksPanelGruppeProps) => {
    const { t } = useTranslation();

    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = get(errors, name)
    const feilmelding = t(getTransKey(error))

    return (
        <SkjemaGruppe>
            <Controller
                name={name}
                control={control}
                rules={{required: true}}
                render={({ field: { value, onChange } }) => (
                    <CheckboxGruppe
                        {...rest}
                        feil={feilmelding}
                        className={"inputPanelGruppe"}
                    >
                        {checkboxes.map((checkbox: CheckboxProps) => (
                            <CheckboksPanel
                                key={checkbox.value as string}
                                label={checkbox.label}
                                value={checkbox.value}
                                checked={(value as any[])?.includes(checkbox.value)}
                                onChange={(e) => onChange(
                                    handleSelect(value, ((e.target as HTMLInputElement).value as any))
                                )}
                            />
                        ))}
                    </CheckboxGruppe>
                )}
            />
        </SkjemaGruppe>
    )
};

interface RHFCheckboksGruppeProps extends Omit<SkjemaGruppeProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>;
    checkboxes: CheckboxProps[];
}

export const RHFCheckboksGruppe = ({ name, checkboxes, ...rest }: RHFCheckboksGruppeProps) => {
    const { t } = useTranslation();

    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = get(errors, name)
    const feilmelding = t(getTransKey(error))

    return (
        <>
            <Controller
                name={name}
                control={control}
                rules={{required: true}}
                render={({ field: { value, onChange } }) => {
                    console.log(value)

                    return (
                        <CheckboxGruppe
                            {...rest}
                            feil={feilmelding}
                        >
                            {checkboxes.map((checkbox: CheckboxProps) => (
                                <Checkbox
                                    key={checkbox.value as string}
                                    label={checkbox.label}
                                    value={checkbox.value}
                                    checked={(value as any[])?.includes(checkbox.value)}
                                    onChange={(e) => onChange(
                                        handleSelect(value, ((e.target as HTMLInputElement).value as any))
                                    )}
                                />
                            ))}
                        </CheckboxGruppe>
                    )
                }}
            />
        </>
    )
};
