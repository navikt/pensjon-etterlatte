import { RHFToValgRadio } from "../../../felles/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { antallAarMellom, ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from "../../../../utils/dato";
import { IValg } from "../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { SkjemaGruppe } from "nav-frontend-skjema";

const gyldigVarighet = (
    datoPartnerskap?: Date,
    datoSkilsmisse?: Date,
    fellesBarn?: IValg
): IValg | undefined => {
    if (!!datoPartnerskap && !!datoSkilsmisse && !!fellesBarn) {
        const antallAar = antallAarMellom(datoPartnerskap, datoSkilsmisse)

        if (antallAar === undefined) return undefined;
        else if (fellesBarn === IValg.JA && antallAar >= 15) return IValg.JA;
        else if (fellesBarn === IValg.NEI && antallAar >= 25) return IValg.JA;
        else return IValg.NEI;
    }
    return undefined;
}

const SkiltFraAvdoede = () => {

    const { watch } = useFormContext<ISoekerOgAvdoed>()

    const datoForInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap")
    const datoForSkilsmisse = watch("forholdTilAvdoede.datoForSkilsmisse")
    const datoForDoedsfallet = watch("avdoed.datoForDoedsfallet")

    const mottokBidrag = watch("forholdTilAvdoede.mottokBidrag")
    const fellesBarn = watch("forholdTilAvdoede.fellesBarn")

    const gyldigVarihetEkteskap = gyldigVarighet(datoForInngaattPartnerskap, datoForSkilsmisse, fellesBarn)

    const bidragMaaUtfylles = gyldigVarihetEkteskap === IValg.JA
        && ugyldigPeriodeFraSamlivsbruddTilDoedsfall(datoForSkilsmisse, datoForDoedsfallet);

    return (
        <>
            <SkjemaGruppe className={"rad"}>
                <Datovelger
                    className={"kol"}
                    name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                    label={"Oppgi dato for inngått ekteskap"}
                    maxDate={datoForDoedsfallet}
                />

                <Datovelger
                    className={"kol"}
                    name={"forholdTilAvdoede.datoForSkilsmisse"}
                    label={"Oppgi dato for skilsmisse (ikke seperasjon)"}
                    minDate={datoForInngaattPartnerskap}
                    maxDate={datoForDoedsfallet}
                />
            </SkjemaGruppe>

            <RHFToValgRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={"Har eller hadde dere barn sammen?"}
            />

            {bidragMaaUtfylles && (
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
