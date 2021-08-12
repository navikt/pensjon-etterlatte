import { RHFRadio } from "../../../felles/RHFRadio";
import { useTranslation } from "react-i18next";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import React from "react";
import { ISituasjon, Utdanning } from "../../../../typer/situasjon";
import { RHFInput } from "../../../felles/RHFInput";
import { useFormContext } from "react-hook-form";

const HoeyesteUtdanning = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>()

    const hoyesteFullfoerteUtdanning = watch("utdanning.hoyesteFullfoerteUtdanning")

    return (
        <>
            <RHFRadio
                name={"utdanning.hoyesteFullfoerteUtdanning"}
                legend={t("dinSituasjon.utdanning.hoyesteFullfoerteUtdanning")}
                radios={Object.values(Utdanning).map(value => {
                    return { label: t(value), value } as RadioProps
                })}
            />

            {hoyesteFullfoerteUtdanning === Utdanning.annen && (
                <SkjemaGruppe>
                    <RHFInput
                        name={"utdanning.annenUtdanning"}
                        label={t("dinSituasjon.utdanning.annenUtdanning")}
                        placeholder={t("dinSituasjon.utdanning.annenUtdanningPlaceholder")}
                    />
                </SkjemaGruppe>
            )}
        </>
    )
}

export default HoeyesteUtdanning;
