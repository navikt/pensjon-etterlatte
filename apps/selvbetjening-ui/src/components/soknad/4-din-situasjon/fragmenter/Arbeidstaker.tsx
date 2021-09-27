import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput, RHFProsentInput, RHFValutaInput } from "../../../felles/RHFInput";
import { RHFSelect } from "../../../felles/RHFSelect";
import { IArbeidsforhold, StillingType } from "../../../../typer/arbeidsforhold";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { FieldArrayWithId, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Panel, Title } from "@navikt/ds-react";
import { IValg } from "../../../../typer/Spoersmaal";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import { DeleteFilled } from "@navikt/ds-icons";
import { useEffect } from "react";

const Arbeidstaker = () => {
    const { t } = useTranslation();

    const { control, watch } = useFormContext();

    const forventerEndretInntekt = watch("arbeidsforhold.forventerEndretInntekt.svar");

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "dinSituasjon.arbeidsforhold",
        shouldUnregister: true,
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({});
        }
    });

    return (
        <SkjemaGruppering>

            <SkjemaGruppe>
                <Title size={"s"}>{t("dinSituasjon.arbeidsforhold.tittel")}</Title>
            </SkjemaGruppe>

            {fields.map((field: FieldArrayWithId, index: number) => (
                <Panel border key={field.id} className={"luft-under"}>

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

                    {forventerEndretInntekt === IValg.JA && (
                        // trenger en måte å komme til riktig index her, eg {`dinSituasjon.arbeidsforhold[${index}].forventerEndretInntekt?.svar`

                        <RHFValutaInput
                            name={`arbeidsforhold[${index}].forventerEndretInntekt.beskrivelse` as const}
                            bredde={"S"}
                            label={t("dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse")}
                        />

                    )}

                    {fields.length > 1 && (
                        <div style={{ textAlign: "right" }}>
                            <Button variant={"secondary"} type={"button"} onClick={() => remove(index)}>
                                <DeleteFilled/> &nbsp;{t("knapp.fjern")}
                            </Button>
                        </div>
                    )}

                </Panel>
            ))}

            <Button variant={"secondary"} type={"button"} onClick={() => append({}, { shouldFocus: true })}>
                + {t("knapp.leggTil")}
            </Button>
        </SkjemaGruppering>
    );
};

export default Arbeidstaker;
