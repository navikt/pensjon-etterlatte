import Datovelger from "../../../felles/Datovelger";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { hentAlder } from "../../../../utils/dato";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { useTranslation } from "react-i18next";

const GiftMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const datoInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap")
    const partnerskapMindreEnnFemAar = !!datoInngaattPartnerskap ? hentAlder(datoInngaattPartnerskap) < 5 : false;

    const ingenFellesBarn = watch("forholdTilAvdoede.fellesBarn") === IValg.NEI;

    return (
        <>
            <Datovelger
                name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                label={t("forholdTilAvdoede.datoForInngaattPartnerskap")}
            />

            {(partnerskapMindreEnnFemAar) && (
                <>
                    <RHFToValgRadio
                        name={"forholdTilAvdoede.fellesBarn"}
                        legend={t("forholdTilAvdoede.fellesBarn")}
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
