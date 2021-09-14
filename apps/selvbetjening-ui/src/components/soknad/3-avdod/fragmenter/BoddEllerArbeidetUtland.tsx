import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { IAvdoed, OppholdUtlandType } from "../../../../typer/person";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useEffect } from "react";
import { RHFCheckboksGruppe } from "../../../felles/RHFCheckboksPanelGruppe";
import SkjemaLinje from "../../../felles/SkjemaLinje";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { DeleteFilled } from "@navikt/ds-icons";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";
import { BodyLong, Button, Panel, Title } from "@navikt/ds-react";

interface Props {
    datoForDoedsfallet?: Date
}

const BoddEllerArbeidetUtland = ({datoForDoedsfallet}: Props) => {
    const { t } = useTranslation();

    const { control, watch } = useFormContext<IAvdoed>();

    const boddEllerArbeidetUtland = watch("boddEllerJobbetUtland.svar");

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "boddEllerJobbetUtland.oppholdUtland",
        shouldUnregister: true,
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({});
        }
    });

    return (
        <>
            <SkjemaGruppe className="ingress">
                <Title size="s">{t("omDenAvdoede.boddEllerJobbetUtland.tittel")}</Title>
                <BodyLong>{t("omDenAvdoede.boddEllerJobbetUtland.ingress")}</BodyLong>
            </SkjemaGruppe>
            <RHFSpoersmaalRadio
                name={"boddEllerJobbetUtland.svar"}
                legend={t("omDenAvdoede.boddEllerJobbetUtland.svar")}
                description={<HvorforSpoerVi>{t("omDenAvdoede.boddEllerJobbetUtland.hjelpetekst")}</HvorforSpoerVi>}
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
                                        {
                                            label: t(OppholdUtlandType.bodd.valueOf()),
                                            value: OppholdUtlandType.bodd,
                                        },
                                        {
                                            label: t(OppholdUtlandType.arbeidet.valueOf()),
                                            value: OppholdUtlandType.arbeidet,
                                        },
                                    ]}
                                />
                            </div>

                            <SkjemaGruppe>
                                <div className={"rad"}>
                                    <div className={"kol"}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].fraDato` as const}
                                            label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato")}
                                            description={t("felles.ikkePaakrevd")}
                                            maxDate={datoForDoedsfallet}
                                            valgfri
                                        />
                                    </div>
                                    <div className={"kol"}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].tilDato` as const}
                                            label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato")}
                                            description={t("felles.ikkePaakrevd")}
                                            maxDate={datoForDoedsfallet}
                                            valgfri
                                        />
                                    </div>
                                </div>
                            </SkjemaGruppe>

                            <RHFSpoersmaalRadio
                                name={`boddEllerJobbetUtland.oppholdUtland[${index}].medlemFolketrygd` as const}
                                legend={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd")}
                                description={
                                    <HvorforSpoerVi>
                                        {t(
                                            "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygdHjelpetekst"
                                        )}
                                    </HvorforSpoerVi>
                                }
                                vetIkke
                            />

                            <RHFInput
                                name={
                                    `boddEllerJobbetUtland.oppholdUtland[${index}].mottokPensjon.beskrivelse` as const
                                }
                                bredde={"S"}
                                valgfri
                                label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse")}
                                description={
                                    <>
                                        {t("felles.ikkePaakrevd")}
                                        <HvorforSpoerVi>
                                            {t(
                                                "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.hjelpetekst"
                                            )}
                                        </HvorforSpoerVi>
                                    </>
                                }
                            />

                            {fields.length > 1 && (
                                <div style={{ textAlign: "right" }}>
                                    <Button variant={"secondary"} type={"button"} onClick={() => remove(index)}>
                                        <DeleteFilled /> &nbsp;{t("knapp.fjern")}
                                    </Button>
                                </div>
                            )}
                        </Panel>
                    ))}

                    <Button variant={"secondary"} type={"button"} onClick={() => append({}, { shouldFocus: true })}>
                        + {t("knapp.leggTil")}
                    </Button>
                </SkjemaLinje>
            )}
        </>
    );
};

export default BoddEllerArbeidetUtland;
