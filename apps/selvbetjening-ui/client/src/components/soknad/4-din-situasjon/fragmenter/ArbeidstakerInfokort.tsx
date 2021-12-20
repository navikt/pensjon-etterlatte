import { memo } from "react";
import { StillingType } from "../../../../typer/arbeidsforhold";
import { useTranslation } from "react-i18next";
import { Button, Panel } from "@navikt/ds-react";
import { RHFInput, RHFProsentInput } from "../../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFSelect } from "../../../felles/RHFSelect";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { DeleteFilled } from "@navikt/ds-icons";
import { useFormContext } from "react-hook-form";

interface Props {
    lengde: number;
    index: number;
    fjern: (index: number) => void;
}

const ArbeidstakerInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation();

    const { watch } = useFormContext();
    const endretInntekt = watch(`arbeidsforhold[${index}].forventerEndretInntekt.svar`);

    return (
        <Panel border className={"luft-under"}>
            <RHFInput
                className={"kol-75"}
                name={`arbeidsforhold[${index}].arbeidsgiver` as const}
                label={t("dinSituasjon.arbeidsforhold.arbeidsgiver")}
            />

            <SkjemaGruppe className={"rad"}>
                <RHFSelect
                    name={`arbeidsforhold[${index}].ansettelsesforhold` as const}
                    label={t("dinSituasjon.arbeidsforhold.ansettelsesforhold")}
                    selectOptions={[
                        { label: t("felles.velg"), value: undefined },
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
                    name={`arbeidsforhold[${index}].stillingsprosent` as const}
                    label={t("dinSituasjon.arbeidsforhold.stillingsprosent")}
                    placeholder={t("dinSituasjon.arbeidsforhold.stillingsprosentPlaceholder")}
                />
            </SkjemaGruppe>

            <RHFSpoersmaalRadio
                name={`arbeidsforhold[${index}].forventerEndretInntekt.svar` as const}
                legend={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar")}
                vetIkke
            />

            {endretInntekt === IValg.JA && (
                <RHFInput
                    name={`arbeidsforhold[${index}].forventerEndretInntekt.beskrivelse` as const}
                    bredde={"S"}
                    label={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse")}
                    placeholder={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelsePlaceholder")}
                    maxLength={200}
                />
            )}

            {lengde > 1 && (
                <div style={{ textAlign: "right" }}>
                    <Button variant={"secondary"} type={"button"} onClick={() => fjern(index)}>
                        <DeleteFilled /> &nbsp;{t("knapp.fjern")}
                    </Button>
                </div>
            )}
        </Panel>
    );
});

export default ArbeidstakerInfokort;
