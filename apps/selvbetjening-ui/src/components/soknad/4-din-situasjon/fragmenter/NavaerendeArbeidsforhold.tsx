import { RadioProps } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RHFRadio } from "../../../felles/RHFRadio";
import { ISituasjon, ArbeidsforholdType } from "../../../../typer/situasjon";
import React from "react";
import Arbeidstaker from "./Arbeidstaker";
import Selvstendig from "./Selvstendig";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";

const NavaerendeArbeidsforhold = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>();

    const selvstendigNaeringsdrivende = watch("selvstendigNaeringsdrivende")

    return (
        <>
            <RHFRadio
                name={"selvstendigNaeringsdrivende"}
                legend={t("dinSituasjon.selvstendigNaeringsdrivende")}
                description={<HvorforSpoerVi>{t("dinSituasjon.selvstendigHvorfor")}</HvorforSpoerVi>}
                radios={Object.values(ArbeidsforholdType).map(value => {
                    return { label: t(value), value } as RadioProps;
                })}
            />

            {(
                selvstendigNaeringsdrivende === ArbeidsforholdType.selvstendig
                || selvstendigNaeringsdrivende === ArbeidsforholdType.begge
            ) && (
                <Selvstendig />
            )}

            {(
                selvstendigNaeringsdrivende === ArbeidsforholdType.arbeidstaker
                || selvstendigNaeringsdrivende === ArbeidsforholdType.begge
            ) && (
                <Arbeidstaker />
            )}
        </>
    );
};

export default NavaerendeArbeidsforhold;
