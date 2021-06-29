import { RHFRadio } from "../../../../felles/RHFRadio";
import { ISoeker } from "../../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { IValg } from "../../../../../typer/Spoersmaal";
import { antallAarMellom } from "../../../../../utils/Utils";
import NyttEkteskap from "./NyttEkteskap";
import NyttSamboerskap from "./NyttSamboerskap";

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
    const opploestDato = watch("nySivilstatus.opploest.dato")
    const opploest = watch("nySivilstatus.opploest.svar")
    const hattBarnEllerVaertGift = watch("samboer.hattBarnEllerVaertGift")

    let gyldigVarighet = harGyldigVarighet(inngaattDato, opploestDato);

    return (
        <>
            <RHFRadio
                name={"nySivilstatus.inngaatt.svar"}
                legend={"Har du inngått nytt ekteskap eller samboerskap etter dødsfallet?"}
                radios={[
                    {
                        label: "Ja, nytt ekteskap",
                        value: Sivilstatus.ekteskap
                    },
                    {
                        label: "Ja, nytt samboerskap",
                        value: Sivilstatus.samboerskap
                    },
                    {
                        label: "Nei, ingen av delene",
                        value: Sivilstatus.ingen
                    },
                ]}
            />

            {sivilstatus === Sivilstatus.ekteskap && (
                <NyttEkteskap
                    opploest={opploest}
                    gyldigVarighet={gyldigVarighet}
                />
            )}

            {sivilstatus === Sivilstatus.samboerskap && (
                <NyttSamboerskap
                    hattBarnEllerVaertGift={hattBarnEllerVaertGift}
                    gyldigVarighet={gyldigVarighet}
                    opploest={opploest}
                />
            )}
        </>
    )
};

export default NySivilstatus;
