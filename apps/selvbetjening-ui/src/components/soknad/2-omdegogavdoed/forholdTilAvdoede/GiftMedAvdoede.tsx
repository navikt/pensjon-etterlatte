import Datovelger from "../../../felles/Datovelger";
import { useFormContext } from "react-hook-form";
import { ISoeker } from "../../../../typer/person";
import { hentAlder } from "../../../../utils/Utils";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";

const GiftMedAvdoede = () => {

    const { watch } = useFormContext<ISoeker>();

    const datoInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap")
    let partnerskapMindreEnnFemAar = false;
    if (!!datoInngaattPartnerskap) {
        partnerskapMindreEnnFemAar = hentAlder(datoInngaattPartnerskap) < 5;
    }

    const ingenFellesBarn = watch("forholdTilAvdoede.fellesBarn") === IValg.NEI;

    return (
        <>
            <Datovelger
                name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                label={"Når ble dere gift?"}
            />

            {(partnerskapMindreEnnFemAar) && (
                <>
                    <RHFToValgRadio
                        name={"forholdTilAvdoede.fellesBarn"}
                        legend={"Har eller hadde dere felles barn?"}
                    />

                    {ingenFellesBarn && (
                        <RHFToValgRadio
                            name={"forholdTilAvdoede.omsorgForBarn"}
                            legend={"Hadde du omsorg for egne og/eller avdødes særkullsbarn på dødstidspunktet?"}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default GiftMedAvdoede;
