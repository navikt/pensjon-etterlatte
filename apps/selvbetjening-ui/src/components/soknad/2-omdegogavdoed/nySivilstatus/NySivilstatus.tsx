import { RHFRadio } from "../../../felles/RHFRadio";
import { ISoeker, Sivilstatus } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import NyttEkteskap from "./NyttEkteskap";
import NyttSamboerskap from "./NyttSamboerskap";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

const NySivilstatus = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>()

    const sivilstatus = watch("nySivilstatus.sivilstatus")

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>{t("omDegOgAvdoed.nySivilstatus.tittel")}</Undertittel>
                <Normaltekst>{t("omDegOgAvdoed.nySivilstatus.beskrivelse")}</Normaltekst>
            </SkjemaGruppe>

            <RHFRadio
                name={"nySivilstatus.sivilstatus"}
                legend={t("omDegOgAvdoed.nySivilstatus.sivilstatus")}
                radios={Object.values(Sivilstatus).map(value => {
                    return { label: t(value), value } as RadioProps
                })}
            />

            {sivilstatus === Sivilstatus.ekteskap && (
                <NyttEkteskap />
            )}

            {sivilstatus === Sivilstatus.samboerskap && (
                <NyttSamboerskap />
            )}
        </>
    );
};

export default NySivilstatus;
