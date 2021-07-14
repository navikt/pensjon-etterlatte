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


const Arbeidstaker = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext();

    const forventerEndretInntekt = watch("arbeidsforhold.forventerEndretInntekt.svar")

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>Info om arbeidsgiver</Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <RHFInput
                    className={"kol-75"}
                    name={"arbeidsforhold.arbeidsgiver"}
                    label={"Hvor jobber du nå?"}
                />
                <Datovelger
                    name={"arbeidsforhold.startDato"}
                    label={t("naavaerendeArbeidsforhold.startDato")}
                    maxDate={watch("arbeidsforhold.sluttDato")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"arbeidsforhold.stilling"}
                    label={"Hvilken stilling har du?"}
                />
            </SkjemaGruppe>

            <div className={"rad skjemagruppe"}>
                <RHFSelect
                    name={"arbeidsforhold.ansettelsesforhold"}
                    label={"Type ansettelse"}
                    selectOptions={[
                        { label: "Velg ...", value: undefined },
                        { label: t("naavaerendeArbeidsforhold.fast"), value: StillingType.fast },
                        { label: t("naavaerendeArbeidsforhold.midlertidig"), value: StillingType.midlertidig },
                        { label: t("naavaerendeArbeidsforhold.sesongarbeid"), value: StillingType.sesongarbeid },
                    ]}
                />

                <RHFInput
                    name={"arbeidsforhold.stillingsprosent"}
                    label={"Hvor mye jobber du?"}
                    placeholder={"eks. 80%"}
                    rules={{ pattern: /\d/ }}
                />
            </div>

            <RHFToValgRadio
                name={"arbeidsforhold.forventerEndretInntekt.svar"}
                legend={"Regner du med at inntekten din endrer seg de neste 12 månedene?"}
                vetIkke
            />

            {forventerEndretInntekt === IValg.JA && (
                <SkjemaGruppe>
                    <RHFValutaInput
                        name={"arbeidsforhold.forventerEndretInntekt.beskrivelse"}
                        label={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse")}
                        hjelpetekst={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.hvorfor")}
                    />
                </SkjemaGruppe>
            )}
        </>
    )
}

export default Arbeidstaker;
