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

const BoddEllerArbeidetUtland = () => {

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
                legend={"Bodde eller arbeidet han/hun i et annet land enn Norge etter fylte 16 år?"}
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
                                    label={"Land"}
                                />
                                <RHFCheckboksGruppe
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].beskrivelse` as const}
                                    legend={"Bodd og/eller arbeidet?"}
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
                                            label={"Fra dato"}
                                            valgfri
                                        />
                                    </div>
                                    <div className={"kol"}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].tilDato` as const}
                                            label={"Til dato"}
                                            valgfri
                                        />
                                    </div>
                                </div>
                            </SkjemaGruppe>
                        </Panel>
                    ))}

                    {/* @ts-ignore */}
                    <Flatknapp htmlType={"button"} onClick={() => append({}, { shouldFocus: true })}>
                        + Legg til
                    </Flatknapp>
                </SkjemaLinje>
            )}
        </>
    )
};

export default BoddEllerArbeidetUtland;
