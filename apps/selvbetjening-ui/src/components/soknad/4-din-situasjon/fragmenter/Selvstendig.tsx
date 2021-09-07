import { RHFInput, RHFValutaInput } from "../../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";
import { Title } from "@navikt/ds-react";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { useFormContext } from "react-hook-form";
import { IValg } from "../../../../typer/Spoersmaal";

const Selvstendig = () => {
    const { t } = useTranslation();
    const { watch } = useFormContext();

    const forventerEndretInntekt = watch("selvstendig.forventerEndretInntekt.svar");

    return (
        <>
            <SkjemaGruppe>
                <Title size={"s"}>{t("dinSituasjon.selvstendig.tittel")}</Title>
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <RHFInput
                    className={"kol-75"}
                    name={"selvstendig.beskrivelse"}
                    label={t("dinSituasjon.selvstendig.beskrivelse")}
                />

                <Datovelger name={"selvstendig.startDato"} label={t("dinSituasjon.selvstendig.startDato")} />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput name={"selvstendig.type"} label={t("dinSituasjon.selvstendig.type")} />
            </SkjemaGruppe>

            <RHFSpoersmaalRadio
                name={"selvstendig.forventerEndretInntekt.svar"}
                legend={t("dinSituasjon.selvstendig.forventerEndretInntekt.svar")}
                vetIkke
            />

            {forventerEndretInntekt === IValg.JA && (
                <SkjemaGruppe>
                    <RHFValutaInput
                        name={"selvstendig.forventerEndretInntekt.beskrivelse"}
                        bredde={"S"}
                        label={t("dinSituasjon.selvstendig.forventerEndretInntekt.beskrivelse")}
                    />
                </SkjemaGruppe>
            )}
        </>
    );
};

export default Selvstendig;
