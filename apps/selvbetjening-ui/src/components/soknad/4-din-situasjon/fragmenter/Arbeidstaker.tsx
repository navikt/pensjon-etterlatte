import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput, RHFValutaInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { RHFSelect } from "../../../felles/RHFSelect";
import { StillingType } from "../../../../typer/arbeidsforhold";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Undertittel } from "nav-frontend-typografi";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";

const Arbeidstaker = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext();

    const forventerEndretInntekt = watch("arbeidsforhold.forventerEndretInntekt.svar");

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>Info om arbeidsgiver</Undertittel>
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
                    maxDate={watch("arbeidsforhold.sluttDato")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput name={"arbeidsforhold.stilling"} label={t("dinSituasjon.arbeidsforhold.stilling")} />
            </SkjemaGruppe>

            <div className={"rad skjemagruppe"}>
                <RHFSelect
                    name={"arbeidsforhold.ansettelsesforhold"}
                    label={t("dinSituasjon.arbeidsforhold.ansettelsesforhold")}
                    selectOptions={[
                        { label: "Velg ...", value: undefined },
                        {
                            label: t("dinSituasjon.arbeidsforhold.naavaerendeArbeidsforhold.fast"),
                            value: StillingType.fast,
                        },
                        {
                            label: t("dinSituasjon.arbeidsforhold.naavaerendeArbeidsforhold.midlertidig"),
                            value: StillingType.midlertidig,
                        },
                        {
                            label: t("dinSituasjon.arbeidsforhold.naavaerendeArbeidsforhold.sesongarbeid"),
                            value: StillingType.sesongarbeid,
                        },
                    ]}
                />

                <RHFInput
                    name={"arbeidsforhold.stillingsprosent"}
                    label={t("dinSituasjon.arbeidsforhold.stillingsprosent")}
                    placeholder={"eks. 80%"}
                    rules={{ pattern: /\d/ }}
                />
            </div>

            <RHFToValgRadio
                name={"arbeidsforhold.forventerEndretInntekt.svar"}
                legend={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar")}
                vetIkke
            />

            {forventerEndretInntekt === IValg.JA && (
                <SkjemaGruppe>
                    <RHFValutaInput
                        name={"arbeidsforhold.forventerEndretInntekt.beskrivelse"}
                        label={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse")}
                        description={<HvorforSpoerVi>{t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.hvorfor")}</HvorforSpoerVi>}
                    />
                </SkjemaGruppe>
            )}
        </>
    );
};

export default Arbeidstaker;
