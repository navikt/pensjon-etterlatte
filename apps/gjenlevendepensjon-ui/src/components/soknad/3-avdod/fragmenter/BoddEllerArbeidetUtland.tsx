import { RHFSpoersmaalRadio } from "../../../felles/rhf/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { IAvdoed, OppholdUtlandType } from "../../../../typer/person";
import { RHFInput } from "../../../felles/rhf/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useEffect } from "react";
import { RHFCheckboksGruppe } from "../../../felles/rhf/RHFCheckboksPanelGruppe";
import { useTranslation } from "react-i18next";
import { DeleteFilled } from "@navikt/ds-icons";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";
import { BodyLong, Button, Panel, Heading } from "@navikt/ds-react";
import { RHFSelect } from "../../../felles/rhf/RHFSelect";
import { useLand } from "../../../../hooks/useLand";
import { SkjemaGruppeIngress } from "../../../felles/StyledComponents";
import { SkjemaElement } from "../../../felles/SkjemaElement";
import { SkjemaGruppe } from "../../../felles/SkjemaGruppe";
import Bredde from "../../../../typer/bredde";
import styled from "styled-components";

const Rad = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  column-gap: 1rem;
`

interface Props {
    datoForDoedsfallet?: Date;
}

const BoddEllerArbeidetUtland = ({ datoForDoedsfallet }: Props) => {
    const { t } = useTranslation();
    const { alleLand }: {land: any, alleLand: any} = useLand();

    const { control, watch } = useFormContext<IAvdoed>();

    const boddEllerArbeidetUtland = watch("boddEllerJobbetUtland.svar");

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "boddEllerJobbetUtland.oppholdUtland",
        shouldUnregister: true,
    });

    useEffect(() => {
        if (boddEllerArbeidetUtland === IValg.JA && fields.length === 0) {
           append({});
        }
    });

    return (
        <SkjemaGruppe>
            <SkjemaGruppeIngress>
                <Heading size="small">{t("omDenAvdoede.boddEllerJobbetUtland.tittel")}</Heading>
                <BodyLong>{t("omDenAvdoede.boddEllerJobbetUtland.ingress")}</BodyLong>
            </SkjemaGruppeIngress>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={"boddEllerJobbetUtland.svar"}
                    legend={t("omDenAvdoede.boddEllerJobbetUtland.svar")}
                    vetIkke
                />
            </SkjemaElement>

            {boddEllerArbeidetUtland === IValg.JA && (
                <SkjemaGruppe>
                    {fields.map((field: FieldArrayWithId, index: number) => (
                        <Panel border key={field.id} className={"luft-under"}>
                            <Rad>
                                <RHFSelect
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].land` as const}
                                    label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land")}
                                    selectOptions={alleLand}
                                />
                                <RHFCheckboksGruppe
                                    name={`boddEllerJobbetUtland.oppholdUtland[${index}].beskrivelse` as const}
                                    legend={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse")}
                                    inline={true}
                                    checkboxes={[
                                        {
                                            children: t(OppholdUtlandType.bodd.valueOf()),
                                            value: OppholdUtlandType.bodd,
                                            required: true
                                        },
                                        {
                                            children: t(OppholdUtlandType.arbeidet.valueOf()),
                                            value: OppholdUtlandType.arbeidet,
                                            required: true
                                        },
                                    ]}
                                />
                            </Rad>

                            <SkjemaElement>
                                <Rad>
                                    <div className={"kol"}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].fraDato` as const}
                                            label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato")}
                                            maxDate={datoForDoedsfallet}
                                            valgfri
                                        />
                                    </div>
                                    <div className={"kol"}>
                                        <Datovelger
                                            name={`boddEllerJobbetUtland.oppholdUtland[${index}].tilDato` as const}
                                            label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato")}
                                            maxDate={datoForDoedsfallet}
                                            valgfri
                                        />
                                    </div>
                                </Rad>
                            </SkjemaElement>

                            <RHFSpoersmaalRadio
                                name={`boddEllerJobbetUtland.oppholdUtland[${index}].medlemFolketrygd` as const}
                                legend={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd")}
                                description={
                                    <HvorforSpoerVi title="omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd">
                                        {t(
                                            "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygdHjelpetekst"
                                        )}
                                    </HvorforSpoerVi>
                                }
                                vetIkke
                            />

                            <SkjemaElement>
                                <RHFInput
                                        name={
                                            `boddEllerJobbetUtland.oppholdUtland[${index}].mottokPensjon.beskrivelse` as const
                                        }
                                        htmlSize={Bredde.S}
                                        valgfri
                                        label={t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse")}
                                        placeholder={t(
                                                "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelsePlaceholder"
                                        )}
                                />
                            </SkjemaElement>

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
                        + {t("knapp.leggTilLand")}
                    </Button>
                </SkjemaGruppe>
            )}
        </SkjemaGruppe>
    );
};

export default BoddEllerArbeidetUtland;
