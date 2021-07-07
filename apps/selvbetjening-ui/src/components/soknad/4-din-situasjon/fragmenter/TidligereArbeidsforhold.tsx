import "../../../felles/Infokort.less";
import { Undertittel } from "nav-frontend-typografi";
import { Flatknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { DeleteFilled } from "@navikt/ds-icons";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { ISituasjon } from "../../../../typer/situasjon";
import { useEffect } from "react";
import classNames from "classnames";

const TidligereArbeidsforhold = () => {
    const { t } = useTranslation();

    const { control } = useFormContext<ISituasjon>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tidligereArbeidsforhold",
        shouldUnregister: true
    });

    useEffect(() => {
        if (fields.length === 0) {
            // @ts-ignore
            append({});
        }
    })

    return (
        <>
            {/* Steg 4 */}
            <SkjemaGruppe>
                <Undertittel>{t("tidligereArbeidsforhold.tittel")}</Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                {fields.map((field: FieldArrayWithId, index) => (
                    <div key={field.id} className={"luft-under"}>
                        <div className={classNames(fields.length > 1 && "rad")}>
                            <div className={classNames(fields.length > 1 && "kol-75")}>
                                <RHFInput
                                    // bredde={"XL"}
                                    name={`tidligereArbeidsforhold[${index}].beskrivelse` as const}
                                    label={"Beskrivelse"}
                                />
                            </div>

                            {fields.length > 1 && (
                                <div className={"kol-25"}>
                                    <Flatknapp
                                        htmlType={"button"}
                                        className={"pull-right"}
                                        onClick={() => remove(index)}
                                    >
                                        <DeleteFilled />
                                    </Flatknapp>
                                </div>
                            )}
                        </div>

                        <div className={"rad"}>
                            <div className={"kol-25"}>
                                <Datovelger
                                    name={`tidligereArbeidsforhold[${index}].fraDato` as const}
                                    label={"Fra"}
                                />
                            </div>

                            <div className={"kol-25"}>
                                <Datovelger
                                    name={`tidligereArbeidsforhold[${index}].tilDato` as const}
                                    label={"Til"}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* @ts-ignore */}
                <Flatknapp htmlType={"button"} onClick={() => append({}, { shouldFocus: true })}>
                    + Legg til
                </Flatknapp>
            </SkjemaGruppe>
        </>
    );
};

export default TidligereArbeidsforhold;
