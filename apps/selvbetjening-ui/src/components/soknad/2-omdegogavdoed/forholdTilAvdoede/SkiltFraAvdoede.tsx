import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { antallAarMellom } from "../../../../utils/dato";
import { IValg } from "../../../../typer/Spoersmaal";
import { AlertStripeAdvarsel } from "nav-frontend-alertstriper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

export const giftMindreEnnFemtenOgDodsfallInnenfemAarEtterSkilsmisse = (
    datoForInngaattPartnerskap: string,
    datoForDoedsfallet: string,
    datoForSkilsmisse: string
): IValg => {
    const antallAarPartnerskap = antallAarMellom(datoForInngaattPartnerskap, datoForSkilsmisse) || 0;
    const antallAarMellomSkillsmisseDodsfall = antallAarMellom(datoForSkilsmisse, datoForDoedsfallet) || 0;

    if (antallAarPartnerskap > 15) {
        return IValg.NEI;
    }
    if (antallAarPartnerskap < 15) {
        if (antallAarMellomSkillsmisseDodsfall < 5) {
            return IValg.NEI;
        }
    }
    return IValg.JA;
};

const giftMerEnn25aar = (datoForInngaattPartnerskap: string, datoForSkilsmisse: string): IValg => {
    const antallAarPartnerskap = antallAarMellom(datoForInngaattPartnerskap, datoForSkilsmisse) || 0;
    if (antallAarPartnerskap >= 25) {
        return IValg.JA;
    }
    return IValg.NEI;
};

const SkiltFraAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();

    const datoForInngaattPartnerskap = watch("forholdTilAvdoede.datoForInngaattPartnerskap");
    const datoForSkilsmisse = watch("forholdTilAvdoede.datoForSkilsmisse");
    const datoForDoedsfallet = watch("avdoed.datoForDoedsfallet");

    const mottokEktefelleBidrag = watch("forholdTilAvdoede.mottokEktefelleBidrag");
    const fellesBarn = watch("forholdTilAvdoede.fellesBarn");
    const samboereMedFellesBarn = watch("forholdTilAvdoede.samboereMedFellesBarn");

    /* Dersom gift i mindre enn 15 år og dødsfall mer/opp til 5 år siden skillsmisse */
    const skalViseSporsmaal = giftMindreEnnFemtenOgDodsfallInnenfemAarEtterSkilsmisse(
        datoForInngaattPartnerskap, // Må sjekke om 25 år gjelder her også
        datoForDoedsfallet,
        datoForSkilsmisse
    );
    const merEnn25aar = giftMerEnn25aar(datoForInngaattPartnerskap, datoForSkilsmisse);

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

            <RHFSpoersmaalRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {/* Dersom felles barn */}
            {fellesBarn === IValg.JA && (
                <>
                    <RHFSpoersmaalRadio
                        name={"forholdTilAvdoede.samboereMedFellesBarn"}
                        legend={t("omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn")}
                    />

                    {samboereMedFellesBarn === IValg.NEI &&
                        merEnn25aar === IValg.NEI && ( // OG ikke samboere/gift i over 25 år?
                            <SkjemaGruppe>
                                <AlertStripeAdvarsel>
                                    {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                                </AlertStripeAdvarsel>
                            </SkjemaGruppe>
                        )}

                    {/* Mottok du ektefellebidrag? */}
                    {skalViseSporsmaal === IValg.JA && samboereMedFellesBarn === IValg.JA && (
                        <>
                            <RHFSpoersmaalRadio
                                name={"forholdTilAvdoede.mottokEktefelleBidrag"}
                                legend={t("omDegOgAvdoed.forholdTilAvdoede.mottokEktefelleBidrag")}
                            />
                            {mottokEktefelleBidrag === IValg.NEI && (
                                <SkjemaGruppe>
                                    <AlertStripeAdvarsel>
                                        {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                                    </AlertStripeAdvarsel>
                                </SkjemaGruppe>
                            )}
                        </>
                    )}
                </>
            )}
            {/* Dersom ikke felles barn */}
            {fellesBarn === IValg.NEI && skalViseSporsmaal === IValg.JA && merEnn25aar === IValg.NEI && (
                <SkjemaGruppe>
                    <AlertStripeAdvarsel>
                        {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                    </AlertStripeAdvarsel>
                </SkjemaGruppe>
            )}
        </>
    );
};

export default SkiltFraAvdoede;
