import { RHFRadio } from "../../../felles/rhf/RHFRadio";
import { useTranslation } from "react-i18next";
import React from "react";
import { ISituasjon, Utdanning } from "../../../../typer/situasjon";
import { RHFInput } from "../../../felles/rhf/RHFInput";
import { useFormContext } from "react-hook-form";
import { Heading, RadioProps } from "@navikt/ds-react";
import { SkjemaElement } from "../../../felles/SkjemaElement";
import { SkjemaGruppe } from "../../../felles/SkjemaGruppe";

const HoeyesteUtdanning = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>()

    const hoyesteFullfoerteUtdanning = watch("utdanning.hoyesteFullfoerteUtdanning")

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={"small"}>{t("dinSituasjon.utdanning.tittelFullfoert")}</Heading>
            </SkjemaElement>
            <RHFRadio
                name={"utdanning.hoyesteFullfoerteUtdanning"}
                legend={t("dinSituasjon.utdanning.hoyesteFullfoerteUtdanning")}
                children={Object.values(Utdanning).map(value => {
                    return { children: t(value), value, required: true } as RadioProps
                })}
            />

            {hoyesteFullfoerteUtdanning === Utdanning.annen && (
                <RHFInput
                    name={"utdanning.annenUtdanning"}
                    label={t("dinSituasjon.utdanning.annenUtdanning")}
                    placeholder={t("dinSituasjon.utdanning.annenUtdanningPlaceholder")}
                />
            )}
        </SkjemaGruppe>
    )
}

export default HoeyesteUtdanning;
