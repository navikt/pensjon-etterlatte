import { RHFToValgRadio } from "../../../felles/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { ISoeker } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { antallAarMellom } from "../../../../utils/Utils";
import { IValg } from "../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";

const gyldigVarighet = (
    datoPartnerskap?: Date,
    datoSkilsmisse?: Date,
    fellesBarn?: IValg
): IValg | undefined => {
    if (!!datoPartnerskap && !!datoSkilsmisse && !!fellesBarn) {
        const antallAar = antallAarMellom(datoPartnerskap, datoSkilsmisse)

        if (fellesBarn === IValg.JA && antallAar >= 15) return IValg.JA;
        else if (fellesBarn === IValg.NEI && antallAar >= 25) return IValg.JA;
        else return IValg.NEI;
    }
    return undefined;
}

const SkiltFraAvdoede = () => {

    const { watch } = useFormContext<ISoeker>()

    const datoForInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap")
    const datoForSkilsmisse = watch("forholdTilAvdoede.datoForSkilsmisse")
    const datoForDoedsfallet = watch("forholdTilAvdoede.datoForDoedsfallet")

    const mottokBidrag = watch("forholdTilAvdoede.mottokBidrag")
    const fellesBarn = watch("forholdTilAvdoede.fellesBarn")

    const gyldigVarihetEkteskap = gyldigVarighet(datoForInngaattPartnerskap, datoForSkilsmisse, fellesBarn)

    let gyldigTidSkilsmisseOgDoedsfall;
    if (!!datoForSkilsmisse && !!datoForDoedsfallet && gyldigVarihetEkteskap === IValg.JA) {
        const antallAar = antallAarMellom(datoForSkilsmisse, datoForDoedsfallet)
        console.log(antallAar)
        if (antallAar >= 5) gyldigTidSkilsmisseOgDoedsfall = IValg.NEI
        else if (antallAar < 5 && antallAar >= 0) gyldigTidSkilsmisseOgDoedsfall = IValg.JA
        else gyldigTidSkilsmisseOgDoedsfall = undefined
    }

    return (
        <>
            <Datovelger
                name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                label={"Oppgi dato for inngått ekteskap"}
                maxDate={new Date()}
            />

            <Datovelger
                name={"forholdTilAvdoede.datoForSkilsmisse"}
                label={"Oppgi dato for skilsmisse (ikke seperasjon)"}
                minDate={datoForInngaattPartnerskap}
                maxDate={new Date()}
            />

            <RHFToValgRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={"Har eller hadde dere barn sammen?"}
            />

            {gyldigVarihetEkteskap === IValg.JA && (
                // TODO: Dette burde være helt i starten av søknaden
                <Datovelger
                    name={"forholdTilAvdoede.datoForDoedsfallet"}
                    label={"Oppgi dato for dødsfallet"}
                    minDate={datoForSkilsmisse}
                    maxDate={new Date()}
                />
            )}

            {gyldigVarihetEkteskap === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ikke rett!
                </AlertStripeAdvarsel>
            )}

            {gyldigTidSkilsmisseOgDoedsfall === IValg.NEI && (
                <RHFToValgRadio
                    name={"forholdTilAvdoede.mottokBidrag"}
                    legend={"Mottok du bidrag fra avdøde/ ble du forsørget av avdøde på dødstidstidspunktet?"}
                />
            )}

            {mottokBidrag === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ikke rett!
                </AlertStripeAdvarsel>
            )}
        </>
    )
};

export default SkiltFraAvdoede;
