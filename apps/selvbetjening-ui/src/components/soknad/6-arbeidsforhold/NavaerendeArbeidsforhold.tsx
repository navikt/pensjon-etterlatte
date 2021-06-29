import React from "react";
import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import Datovelger from "../../felles/Datovelger";
import { RHFInput } from "../../felles/RHFInput";
import { RHFToValgRadio } from "../../felles/RHFRadio";
import { StillingType } from "../../../typer/arbeidsforhold";
import { ISituasjon } from "../../../typer/situasjon";
import { RHFSelect } from "../../felles/RHFSelect";

const NavaerendeArbeidsforhold = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>();

    const heltidDeltid = watch("arbeidsforhold.heltidDeltid")

    return (
        <>
            <SkjemaGruppe>
                <RHFInput
                    name={"arbeidsforhold.stillingEllerYrke"}
                    label={t("naavaerendeArbeidsforhold.stillingEllerYrke")}
                />
            </SkjemaGruppe>

            <Datovelger
                name={"arbeidsforhold.startDato"}
                label={t("naavaerendeArbeidsforhold.startDato")}
                maxDate={watch("arbeidsforhold.sluttDato")}
            />

            <SkjemaGruppe>
                <RHFSelect
                    name={"arbeidsforhold.ansettelsesforhold"}
                    label={t("naavaerendeArbeidsforhold.ansettelsesforhold")}
                    selectOptions={[
                        { label: "Velg ...", value: undefined },
                        { label: t("naavaerendeArbeidsforhold.fast"), value: StillingType.Fast },
                        { label: t("naavaerendeArbeidsforhold.midlertidig"), value: StillingType.Midlertidig },
                        { label: t("naavaerendeArbeidsforhold.sesongarbeid"), value: StillingType.Sesongarbeid },
                    ]}
                />
            </SkjemaGruppe>

            <div className={"rad skjemagruppe"}>
                <RHFSelect
                    // className={"kolonne"}
                    name={"arbeidsforhold.heltidDeltid"}
                    label={t("naavaerendeArbeidsforhold.heltidDeltid")}
                    selectOptions={[
                        { label: "Velg ...", value: undefined },
                        { label: t("naavaerendeArbeidsforhold.heltid"), value: "Heltid" },
                        { label: t("naavaerendeArbeidsforhold.deltid"), value: "Deltid" },
                    ]}
                />

                {heltidDeltid === "Deltid" && (
                    <RHFInput
                        className={"kolonne"}
                        name={"arbeidsforhold.stillingsprosent"}
                        label={t("naavaerendeArbeidsforhold.stillingsprosent")}
                        rules={{ pattern: /^[0-9]{1,2}$/ }}
                    />
                )}
            </div>

            <SkjemaGruppe>
                <RHFInput
                    name={"arbeidsforhold.arbeidsgiver.navn"}
                    label={t("naavaerendeArbeidsforhold.arbeidsgiver.navn")}
                />
                <RHFInput
                    name={"arbeidsforhold.arbeidsgiver.adresse"}
                    label={t("naavaerendeArbeidsforhold.arbeidsgiver.adresse")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"arbeidsforhold.inntekt.bruttoArbeidsinntektPrMd"}
                    label={t("naavaerendeArbeidsforhold.inntekt.bruttoArbeidsinntektPrMd")}
                    rules={{ pattern: /^\d+$/ }}
                />
                <RHFInput
                    name={"arbeidsforhold.inntekt.personinntektFraNaeringPrAr"}
                    label={t("naavaerendeArbeidsforhold.inntekt.personinntektFraNaeringPrAr")}
                    rules={{ pattern: /^\d+$/ }}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFToValgRadio
                    name={"arbeidsforhold.forventerEndretInntekt"}
                    legend={"arbeidsforhold.forventerEndretInntekt"}
                />
            </SkjemaGruppe>
        </>
    );
};

export default NavaerendeArbeidsforhold;
