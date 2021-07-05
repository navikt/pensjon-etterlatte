import { RHFRadio } from "../../../../felles/RHFRadio";
import { ISoeker } from "../../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { IValg } from "../../../../../typer/Spoersmaal";
import { antallAarMellom } from "../../../../../utils/Utils";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import NyttEkteskap from "./NyttEkteskap";
import NyttSamboerskap from "./NyttSamboerskap";
import { SkjemaGruppe } from "nav-frontend-skjema";

enum Sivilstatus {
    ekteskap = "ekteskap",
    samboerskap = "samboerskap",
    ingen = "ingen"
}

const harGyldigVarighet = (inngaattDato?: Date, opploestDato?: Date) => {
    if (!!inngaattDato && !!opploestDato) {
        const antallAar = antallAarMellom(inngaattDato, opploestDato)
        if (antallAar >= 0 && antallAar < 2)
            return IValg.JA;
        else if (antallAar >= 2)
            return IValg.NEI;
    }
    return undefined;
}

const NySivilstatus = () => {
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
                radios={[
                    {
                        label: "Ja, jeg har giftet meg på nytt",
                        value: Sivilstatus.ekteskap
                    },
                    {
                        label: "Ja, jeg har fått samboer",
                        value: Sivilstatus.samboerskap
                    },
                    {
                        label: "Nei, ingen av delene",
                        value: Sivilstatus.ingen
                    },
                ]}
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
