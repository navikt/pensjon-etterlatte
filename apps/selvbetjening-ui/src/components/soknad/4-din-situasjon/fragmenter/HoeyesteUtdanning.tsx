import { RHFRadio } from "../../../felles/RHFRadio";
import { useTranslation } from "react-i18next";
import { RHFSelect } from "../../../felles/RHFSelect";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import React from "react";
import { ISituasjon, Utdanning } from "../../../../typer/situasjon";
import { useFormContext } from "react-hook-form";


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

            {(utdanning === "Universitet/høyskole") && (
                <SkjemaGruppe>
                    <RHFSelect
                        name={"utdanning.antallAarUniversitetHoyskole"}
                        label={t("utdanning.antallAarUniversitetHoyskole")}
                        selectOptions={[
                            { label: "Velg ...", value: undefined },
                            { label: "1-3 år", value: "1-3 år" },
                            { label: "3-5 år", value: "3-5 år" }
                        ]}
                    />
                </SkjemaGruppe>
            )}
        </>
    )
}

export default HoeyesteUtdanning;
