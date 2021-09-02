import { RHFRadio } from "../../../felles/RHFRadio";
import { ISoeker, Sivilstatus } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import NyttEkteskap from "./NyttEkteskap";
import NyttSamboerskap from "./NyttSamboerskap";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { BodyLong, Title } from "@navikt/ds-react";

const NySivilstatus = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const sivilstatus = watch("nySivilstatus.sivilstatus");

    return (
        <>
            <SkjemaGruppe>
                <Title size={"s"}>{t("omDegOgAvdoed.nySivilstatus.tittel")}</Title>

                <BodyLong>{t("omDegOgAvdoed.nySivilstatus.beskrivelse")}</BodyLong>
            </SkjemaGruppe>

            <RHFRadio
                name={"nySivilstatus.sivilstatus"}
                radios={Object.values(Sivilstatus).map((value) => {
                    return { label: t(value), value } as RadioProps;
                })}
            />

            {sivilstatus === Sivilstatus.ekteskap && <NyttEkteskap />}

            {sivilstatus === Sivilstatus.samboerskap && <NyttSamboerskap />}
        </>
    );
};

export default NySivilstatus;
