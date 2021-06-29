import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoeker } from "../../../../typer/person";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { antallAarMellom } from "../../../../utils/Utils";
import Datovelger from "../../../felles/Datovelger";
import NySivilstatus from "./nySivilstatus/NySivilstatus";

const  TidligereSamboerMedAvdoede = () => {

    const { watch } = useFormContext<ISoeker>();

    const datoForSamlivsbrudd = watch("forholdTilAvdoede.datoForSamlivsbrudd")
    const datoForDoedsfallet = watch("forholdTilAvdoede.datoForDoedsfallet")
    const fellesBarn = watch("forholdTilAvdoede.fellesBarn");
    const mottokBidrag = watch("forholdTilAvdoede.mottokBidrag");

    // TODO: Fikse logikk
    let ugyldigIntervall = false;
    if (!!datoForSamlivsbrudd && !!datoForDoedsfallet) {
        ugyldigIntervall = antallAarMellom(datoForSamlivsbrudd, datoForDoedsfallet) < 5;
    }

    return (
        <>
            <RHFToValgRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={"Har/hadde dere felles barn?"}
            />

            {fellesBarn === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ingen rett!
                </AlertStripeAdvarsel>
            )}

            {fellesBarn === IValg.JA && (
                <>
                    {/* TODO: Burde være eget felt for inngått samboerskap? */}
                    <Datovelger
                        name={"forholdTilAvdoede.datoForInngaattSamboerskap"}
                        label={"Dato for inngått samboerskap"}
                    />

                    <Datovelger
                        name={"forholdTilAvdoede.datoForSamlivsbrudd"}
                        label={"Dato for samlivsbruddet (ikke separasjon)"}
                    />

                    <Datovelger
                        name={"forholdTilAvdoede.datoForDoedsfallet"}
                        label={"Dato for dødsfallet"}
                    />

                    {ugyldigIntervall && (
                        <RHFToValgRadio
                            name={"forholdTilAvdoede.mottokBidrag"}
                            legend={"Mottok du bidrag fra avdøde/ ble du forsørget av avdøde på dødstidstidspunktet?"}
                        />
                    )}

                    {mottokBidrag === IValg.NEI && (
                        <AlertStripeAdvarsel>Ikke rett</AlertStripeAdvarsel>
                    )}
                </>
            )}

            <NySivilstatus />
        </>
    )
}

export default TidligereSamboerMedAvdoede;
