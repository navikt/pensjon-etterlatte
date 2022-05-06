import { RHFRadio } from "../../../felles/RHFRadio";
import { useTranslation } from "react-i18next";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import React from "react";
import { ISituasjon, Utdanning } from "../../../../typer/situasjon";
import { RHFInput } from "../../../felles/RHFInput";
import { useFormContext } from "react-hook-form";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import { Heading } from "@navikt/ds-react";

const HoeyesteUtdanning = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>()

    const hoyesteFullfoerteUtdanning = watch("utdanning.hoyesteFullfoerteUtdanning")

    return (
        <SkjemaGruppering>
            <SkjemaGruppe>
                <Heading size={"small"}>{t("dinSituasjon.utdanning.tittelFullfoert")}</Heading>
            </SkjemaGruppe>
            <RHFRadio
                name={"utdanning.hoyesteFullfoerteUtdanning"}
                legend={t("dinSituasjon.utdanning.hoyesteFullfoerteUtdanning")}
                radios={Object.values(Utdanning).map(value => {
                    return { label: t(value), value, required: true } as RadioProps
                })}
            />

            {hoyesteFullfoerteUtdanning === Utdanning.annen && (
                <RHFInput
                    name={"utdanning.annenUtdanning"}
                    label={t("dinSituasjon.utdanning.annenUtdanning")}
                    placeholder={t("dinSituasjon.utdanning.annenUtdanningPlaceholder")}
                />
            )}
        </SkjemaGruppering>
    )
}

export default HoeyesteUtdanning;
