import Datovelger from "../../../felles/Datovelger";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { hentAlder } from "../../../../utils/dato";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";

const GiftMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const datoInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap")
    const partnerskapMindreEnnFemAar = !!datoInngaattPartnerskap ? hentAlder(datoInngaattPartnerskap) < 5 : false;

    const ingenFellesBarn = watch("forholdTilAvdoede.fellesBarn") === IValg.NEI;

    return (
        <>
            <SkjemaGruppe>
                <Datovelger
                    name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                    label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap")}
                    description={
                        <HvorforSpoerVi>
                            {t("omDegOgAvdoed.forholdTilAvdoede.hvorforDatoForInngaattPartnerskap")}
                        </HvorforSpoerVi>
                    }
                />
            </SkjemaGruppe>

            {(partnerskapMindreEnnFemAar) && (
                <>
                    <RHFSpoersmaalRadio
                        name={"forholdTilAvdoede.fellesBarn"}
                        legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
                    />

                    {ingenFellesBarn && (
                        <RHFSpoersmaalRadio
                            name={"forholdTilAvdoede.omsorgForBarn"}
                            legend={t("omDegOgAvdoed.forholdTilAvdoede.omsorgForBarn")}
                        />
                    )}
                </>
            )}
        </>
    )
};

export default GiftMedAvdoede;
