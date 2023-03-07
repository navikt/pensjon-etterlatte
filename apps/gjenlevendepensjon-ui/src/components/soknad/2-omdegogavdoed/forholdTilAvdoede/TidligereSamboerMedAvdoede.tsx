import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from "../../../../utils/dato";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";
import {SkjemaGruppeRad} from "../../../felles/StyledComponents";
import {SkjemaGruppe} from "../../../felles/SkjemaGruppe";

const TidligereSamboerMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();
    const { state } = useBrukerContext();

    const datoForInngaattSamboerskap: any = watch("forholdTilAvdoede.datoForInngaattSamboerskap")
    const datoForSamlivsbrudd: any = watch("forholdTilAvdoede.datoForSamlivsbrudd")
    const datoForDoedsfallet: any = watch("avdoed.datoForDoedsfallet")
    const fellesBarn = watch("forholdTilAvdoede.fellesBarn");

    const bidragMaaUtfylles = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(datoForSamlivsbrudd, datoForDoedsfallet);

    return (
        <SkjemaGruppe>
            <RHFSpoersmaalRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {fellesBarn === IValg.JA && (
                <>
                    {/* TODO: Burde være eget felt for inngått samboerskap? */}
                    <SkjemaGruppeRad>
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
                    </SkjemaGruppeRad>

                    {bidragMaaUtfylles && (
                        <RHFSpoersmaalRadio
                            name={"forholdTilAvdoede.mottokBidrag"}
                            legend={t("omDegOgAvdoed.forholdTilAvdoede.mottokBidrag")}
                        />
                    )}
                </>
            )}
        </SkjemaGruppe>
    )
}

export default TidligereSamboerMedAvdoede;
