import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from "../../../../utils/dato";
import { useTranslation } from "react-i18next";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";

const TidligereSamboerMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();
    const { state } = useBrukerContext();

    const datoForInngaattSamboerskap = watch("forholdTilAvdoede.datoForInngaattSamboerskap")
    const datoForSamlivsbrudd = watch("forholdTilAvdoede.datoForSamlivsbrudd")
    const datoForDoedsfallet = watch("avdoed.datoForDoedsfallet")
    const fellesBarn = watch("forholdTilAvdoede.fellesBarn");

    const bidragMaaUtfylles = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(datoForSamlivsbrudd, datoForDoedsfallet);

    return (
        <SkjemaGruppering>
            <RHFSpoersmaalRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {fellesBarn === IValg.JA && (
                <>
                    {/* TODO: Burde være eget felt for inngått samboerskap? */}
                    <SkjemaGruppe className={"rad"}>
                        <div className={"kol"}>
                            <Datovelger
                                name={"forholdTilAvdoede.datoForInngaattSamboerskap"}
                                label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap")}
                                minDate={state.foedselsdato}
                                maxDate={datoForDoedsfallet || new Date()}
                            />
                        </div>

                        <div className={"kol"}>
                            <Datovelger
                                name={"forholdTilAvdoede.datoForSamlivsbrudd"}
                                label={t("omDegOgAvdoed.forholdTilAvdoede.datoForSamlivsbrudd")}
                                minDate={datoForInngaattSamboerskap}
                                maxDate={datoForDoedsfallet || new Date()}
                            />
                        </div>
                    </SkjemaGruppe>

                    {bidragMaaUtfylles && (
                        <RHFSpoersmaalRadio
                            name={"forholdTilAvdoede.mottokBidrag"}
                            legend={t("omDegOgAvdoed.forholdTilAvdoede.mottokBidrag")}
                        />
                    )}
                </>
            )}
        </SkjemaGruppering>
    )
}

export default TidligereSamboerMedAvdoede;
