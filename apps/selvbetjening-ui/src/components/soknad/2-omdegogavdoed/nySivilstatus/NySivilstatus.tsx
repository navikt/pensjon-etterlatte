import { RHFRadio } from "../../../felles/RHFRadio";
import { ISoeker, Sivilstatus } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { IValg } from "../../../../typer/Spoersmaal";
import { antallAarMellom } from "../../../../utils/dato";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import NyttEkteskap from "./NyttEkteskap";
import NyttSamboerskap from "./NyttSamboerskap";
import { RadioProps, SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

const harGyldigVarighet = (inngaattDato?: Date, opploestDato?: Date) => {
    if (!!inngaattDato && !!opploestDato) {
        const antallAar = antallAarMellom(inngaattDato, opploestDato)

        if (antallAar === undefined) return undefined;
        if (antallAar >= 0 && antallAar < 2)
            return IValg.JA;
        else if (antallAar >= 2)
            return IValg.NEI;
    }
    return undefined;
}

const NySivilstatus = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>()

    const sivilstatus = watch("nySivilstatus.inngaatt.svar")
    const inngaattDato = watch("nySivilstatus.inngaatt.dato")
    const opploestDato = watch("nySivilstatus.opploestDato")

    let gyldigVarighet = harGyldigVarighet(inngaattDato, opploestDato);

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>{t("omDegOgAvdoed.nySivilstatus.tittel")}</Undertittel>
                <Normaltekst>{t("omDegOgAvdoed.nySivilstatus.beskrivelse")}</Normaltekst>
            </SkjemaGruppe>

            <RHFRadio
                name={"nySivilstatus.inngaatt.svar"}
                legend={t("omDegOgAvdoed.nySivilstatus.inngaatt.svar")}
                radios={Object.values(Sivilstatus).map(value => {
                    return { label: t(value), value } as RadioProps
                })}
            />

            {sivilstatus === Sivilstatus.ekteskap && (
                <NyttEkteskap gyldigVarighet={gyldigVarighet} />
            )}

            {sivilstatus === Sivilstatus.samboerskap && (
                <NyttSamboerskap gyldigVarighet={gyldigVarighet} />
            )}
        </>
    );
};

export default NySivilstatus;
