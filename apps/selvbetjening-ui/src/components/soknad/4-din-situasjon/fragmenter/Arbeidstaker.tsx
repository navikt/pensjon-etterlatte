import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput, RHFProsentInput, RHFValutaInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { RHFSelect } from "../../../felles/RHFSelect";
import { StillingType } from "../../../../typer/arbeidsforhold";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Title } from "@navikt/ds-react";
import { IValg } from "../../../../typer/Spoersmaal";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";

const Arbeidstaker = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext();

    const forventerEndretInntekt = watch("arbeidsforhold.forventerEndretInntekt.svar");

    return (
        <SkjemaGruppering>
            <SkjemaGruppe>
                <Title size={"s"}>{t("dinSituasjon.arbeidsforhold.tittel")}</Title>
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <RHFInput
                    className={"kol-75"}
                    name={"arbeidsforhold.arbeidsgiver"}
                    label={t("dinSituasjon.arbeidsforhold.arbeidsgiver")}
                />
                <Datovelger
                    name={"arbeidsforhold.startDato"}
                    label={t("dinSituasjon.arbeidsforhold.startDato")}
                    maxDate={new Date()}
                />
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <RHFSelect
                    name={"arbeidsforhold.ansettelsesforhold"}
                    label={t("dinSituasjon.arbeidsforhold.ansettelsesforhold")}
                    selectOptions={[
                        { label: "Velg ...", value: undefined },
                        {
                            label: t("stillingType.fast"),
                            value: StillingType.fast,
                        },
                        {
                            label: t("stillingType.midlertidig"),
                            value: StillingType.midlertidig,
                        },
                        {
                            label: t("stillingType.sesongarbeid"),
                            value: StillingType.sesongarbeid,
                        },
                    ]}
                />

                <RHFProsentInput
                    name={"arbeidsforhold.stillingsprosent"}
                    label={t("dinSituasjon.arbeidsforhold.stillingsprosent")}
                    placeholder={t("dinSituasjon.arbeidsforhold.stillingsprosentPlaceholder")}
                />
            </SkjemaGruppe>

            <RHFSpoersmaalRadio
                name={"arbeidsforhold.forventerEndretInntekt.svar"}
                legend={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar")}
                vetIkke
            />


            {forventerEndretInntekt === IValg.JA && (

                <RHFValutaInput
                    name={"arbeidsforhold.forventerEndretInntekt.beskrivelse"}
                    bredde={"S"}
                    label={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse")}
                />

            )}

        </SkjemaGruppering>
    );
};

export default Arbeidstaker;
