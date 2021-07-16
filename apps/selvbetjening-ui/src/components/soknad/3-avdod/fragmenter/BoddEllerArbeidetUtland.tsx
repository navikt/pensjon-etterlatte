import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { IAvdoed } from "../../../../typer/person";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useEffect } from "react";
import { RHFCheckboksGruppe } from "../../../felles/RHFCheckboksPanelGruppe";
import { Flatknapp } from "nav-frontend-knapper";
import Panel from "nav-frontend-paneler";
import SkjemaLinje from "../../../felles/SkjemaLinje";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

const BoddEllerArbeidetUtland = () => {
    const { t } = useTranslation();

    const { control, watch } = useFormContext<IAvdoed>();

    const boddEllerArbeidetUtland = watch("boddEllerJobbetUtland.svar")

    // TODO: støtte fjerning av element
    const { fields, append } = useFieldArray({
        control,
        name: "boddEllerJobbetUtland.oppholdUtland",
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
            <RHFToValgRadio
                name={"boddEllerJobbetUtland.svar"}
                legend={t("omDenAvdoede.boddEllerJobbetUtland.svar")}
                hjelpetekst={t("omDenAvdoede.boddEllerJobbetUtland.hjelpetekst")}
                vetIkke
            />

            {boddEllerArbeidetUtland === IValg.JA && (
                <SkjemaLinje>
                    {fields.map((field: FieldArrayWithId, index: number) => (
                        <Panel border key={field.id} className={"luft-under"}>
                            <div className={"rad"}>
                                <RHFInput
                                    className={"kol"}
                                    bredde={"XL"}
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].land` as const}
                                    label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land")}
                                />
                                <RHFCheckboksGruppe
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].beskrivelse` as const}
                                    legend={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse")}
                                    className={"kol inline"}
                                    checkboxes={[
                                        { label: "Bodd", value: "Bodd" },
                                        { label: "Arbeidet", value: "Arbeidet" }
                                    ]}
                                />
                            </div>

                            {/*{fields.length > 1 && (
                                <Flatknapp
                                    htmlType={"button"}
                                    className={"sletteknapp"}
                                    onClick={() => remove(index)}
                                >
                                    <DeleteFilled/>
                                </Flatknapp>
                            )}*/}

                            <SkjemaGruppe description={"Fra og til dato er ikke påkrevd"}>
                                <div className={"rad"}>
                                    <div className={"kol"}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].fraDato` as const}
                                            label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato")}
                                            valgfri
                                        />
                                    </div>
                                    <div className={"kol"}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].tilDato` as const}
                                            label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato")}
                                            valgfri
                                        />
                                    </div>
                                </div>
                            </SkjemaGruppe>
                        </Panel>
                    ))}

                    {/* @ts-ignore */}
                    <Flatknapp htmlType={"button"} onClick={() => append({}, { shouldFocus: true })}>
                        {t("knapp.leggTil")}
                    </Flatknapp>
                </SkjemaLinje>
            )}
        </>
    )
};

export default BoddEllerArbeidetUtland;
