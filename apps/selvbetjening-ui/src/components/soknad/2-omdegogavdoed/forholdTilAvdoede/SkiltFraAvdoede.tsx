import { RHFToValgRadio } from "../../../felles/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { antallAarMellom, ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from "../../../../utils/dato";
import { IValg } from "../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

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
                    label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap")}
                    maxDate={datoForDoedsfallet}
                />

                <Datovelger
                    className={"kol"}
                    name={"forholdTilAvdoede.datoForSkilsmisse"}
                    label={t("omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse")}
                    minDate={datoForInngaattPartnerskap}
                    maxDate={datoForDoedsfallet}
                />
            </SkjemaGruppe>

            <RHFToValgRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {bidragMaaUtfylles && (
                <RHFToValgRadio
                    name={"forholdTilAvdoede.mottokBidrag"}
                    legend={t("omDegOgAvdoed.forholdTilAvdoede.mottokBidrag")}
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
