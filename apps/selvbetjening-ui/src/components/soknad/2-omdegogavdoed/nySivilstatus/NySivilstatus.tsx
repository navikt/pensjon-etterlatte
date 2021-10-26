import { RHFRadio } from "../../../felles/RHFRadio";
import { ISoeker, Sivilstatus } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { BodyLong, Heading } from "@navikt/ds-react";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import SamboerSkjema from "./SamboerSkjema";

const NySivilstatus = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const sivilstatus = watch("nySivilstatus.sivilstatus");
    return (
        <SkjemaGruppering>
            <SkjemaGruppe>
                <Heading size={"small"}>{t("omDegOgAvdoed.nySivilstatus.sivilstatus")}</Heading>

                <BodyLong>{t("omDegOgAvdoed.nySivilstatus.beskrivelse")}</BodyLong>
            </SkjemaGruppe>

            <RHFRadio
                name={"nySivilstatus.sivilstatus"}
                radios={Object.values(Sivilstatus).map((value) => {
                    return { label: t(value), value, required: true } as RadioProps;
                })}
            />

            {sivilstatus === Sivilstatus.samboerskap && <SamboerSkjema/>}
        </SkjemaGruppering>
    );
};

export default NySivilstatus;
