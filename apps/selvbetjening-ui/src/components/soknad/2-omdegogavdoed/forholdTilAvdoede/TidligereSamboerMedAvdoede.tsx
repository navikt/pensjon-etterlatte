import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import Datovelger from "../../../felles/Datovelger";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from "../../../../utils/dato";
import { useTranslation } from "react-i18next";

const  TidligereSamboerMedAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const datoForSamlivsbrudd = watch("forholdTilAvdoede.datoForSamlivsbrudd")
    const datoForDoedsfallet = watch("avdoed.datoForDoedsfallet")
    const fellesBarn = watch("forholdTilAvdoede.fellesBarn");

    const bidragMaaUtfylles  = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(datoForSamlivsbrudd, datoForDoedsfallet);

    return (
        <>
            <RHFToValgRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {fellesBarn === IValg.NEI && (
                <AlertStripeAdvarsel>
                    Ingen rett!
                </AlertStripeAdvarsel>
            )}

            {fellesBarn === IValg.JA && (
                <>
                    {/* TODO: Burde være eget felt for inngått samboerskap? */}
                    <SkjemaGruppe className={"rad"}>
                        <div className={"kol"}>
                            <Datovelger
                                name={"forholdTilAvdoede.datoForInngaattSamboerskap"}
                                label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap")}
                                maxDate={datoForDoedsfallet}
                            />
                        </div>

                        <div className={"kol"}>
                            <Datovelger
                                name={"forholdTilAvdoede.datoForSamlivsbrudd"}
                                label={t("omDegOgAvdoed.forholdTilAvdoede.datoForSamlivsbrudd")}
                                maxDate={datoForDoedsfallet}
                            />
                        </div>
                    </SkjemaGruppe>

                    {bidragMaaUtfylles && (
                        <RHFToValgRadio
                            name={"forholdTilAvdoede.mottokBidrag"}
                            legend={t("omDegOgAvdoed.forholdTilAvdoede.mottokBidrag")}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default TidligereSamboerMedAvdoede;
