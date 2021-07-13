import { RHFRadio } from "../../../felles/RHFRadio";
import { useTranslation } from "react-i18next";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import React from "react";
import { ISituasjon, Utdanning } from "../../../../typer/situasjon";
import { useFormContext } from "react-hook-form";
import { RHFInput } from "../../../felles/RHFInput";

const HoeyesteUtdanning = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>()

    const utdanning = watch("utdanning.hoyesteFullfoerteUtdanning");

    return (
        <>
            <RHFRadio
                name={"utdanning.hoyesteFullfoerteUtdanning"}
                legend={"Hva er din høyeste fullførte utdanning?"}
                radios={Object.values(Utdanning).map(value => {
                    return { label: t(value), value } as RadioProps
                })}
            />

            {(utdanning === Utdanning.annen) && (
                <SkjemaGruppe>
                    <RHFInput
                        name={"utdanning.annenUtdanning"}
                        label={"Annen utdanning"}
                        placeholder={"F.eks. kurs, enkeltår på universitet eller høyskole"}
                    />
                </SkjemaGruppe>
            )}
        </>
    )
}

export default HoeyesteUtdanning;
