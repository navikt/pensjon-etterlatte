import { IValg } from "../../../../typer/Spoersmaal";
import { useFormContext } from "react-hook-form";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { Alert } from "@navikt/ds-react";
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
            <RHFSpoersmaalRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {fellesBarn === IValg.NEI && (
                <SkjemaGruppe>
                    <Alert variant={"warning"}>
                        {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                    </Alert>
                </SkjemaGruppe>
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
                        <RHFSpoersmaalRadio
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
