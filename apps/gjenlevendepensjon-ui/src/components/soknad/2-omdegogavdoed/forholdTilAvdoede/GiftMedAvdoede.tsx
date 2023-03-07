import Datovelger from "../../../felles/Datovelger";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { hentAlder } from "../../../../utils/dato";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { IValg } from "../../../../typer/Spoersmaal";
import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "../../../felles/SkjemaGruppe";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";
import {SkjemaElement} from "../../../felles/SkjemaElement";

const GiftMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();
    const { state } = useBrukerContext();

    const datoInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap");
    const partnerskapMindreEnnFemAar = !!datoInngaattPartnerskap ? hentAlder(datoInngaattPartnerskap) < 5 : false;

    const ingenFellesBarn = watch("forholdTilAvdoede.fellesBarn") === IValg.NEI;
    const datoforDoedsfallet = watch("avdoed.datoForDoedsfallet");

    return (
        <>
            <SkjemaGruppe>
                <Datovelger
                    name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                    label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap")}
                    minDate={state.foedselsdato}
                    maxDate={datoforDoedsfallet || new Date()}
                />
            </SkjemaGruppe>
            {partnerskapMindreEnnFemAar && (
                <SkjemaElement>
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
                </SkjemaElement>
            )}
        </>
    );
};

export default GiftMedAvdoede;
