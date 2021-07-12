import { RHFRadio } from "../../../../felles/RHFRadio";
import { ISoeker, Sivilstatus } from "../../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { IValg } from "../../../../../typer/Spoersmaal";
import { antallAarMellom } from "../../../../../utils/dato";
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
                <Undertittel>Nåværende sivilstand</Undertittel>
                <Normaltekst>Hvis sivilstanden din har endret seg så trenger vi informasjon om dette.</Normaltekst>
            </SkjemaGruppe>

            <RHFRadio
                name={"nySivilstatus.inngaatt.svar"}
                legend={"Har du giftet deg på nytt eller fått samboer?"}
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
