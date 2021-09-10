import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { antallAarMellom } from "../../../../utils/dato";
import { IValg } from "../../../../typer/Spoersmaal";
import { Alert } from "@navikt/ds-react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";

const giftMerEnn25aar = (datoForInngaattPartnerskap: string, datoForSkilsmisse: string): IValg => {
    const antallAarPartnerskap = antallAarMellom(datoForInngaattPartnerskap, datoForSkilsmisse) || 0;
    if (antallAarPartnerskap >= 25) {
        return IValg.JA;
    }
    return IValg.NEI;
};
const giftMindreEnn15aar = (datoForInngaattPartnerskap: string, datoForSkilsmisse: string) => {
    const antallAarPartnerskap = antallAarMellom(datoForInngaattPartnerskap, datoForSkilsmisse) || 0;
    if (antallAarPartnerskap < 15) {
        return IValg.JA;
    }
    return IValg.NEI;
};

const mindreEnnFemaarMellomSkillsmisseOgDodsfall = (datoForSkilsmisse: string, datoForDoedsfallet: string) => {
    const antallAarMellomSkillsmisseDodsfall = antallAarMellom(datoForSkilsmisse, datoForDoedsfallet) || 0;
    if (antallAarMellomSkillsmisseDodsfall <= 5) {
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

    const mindreEnn15aar = giftMindreEnn15aar(datoForInngaattPartnerskap, datoForSkilsmisse);
    const merEnn25aar = giftMerEnn25aar(datoForInngaattPartnerskap, datoForSkilsmisse);
    const mindreEnnFemAar = mindreEnnFemaarMellomSkillsmisseOgDodsfall(datoForSkilsmisse, datoForDoedsfallet);

    return (
        <>
            <SkjemaGruppe className={"rad col-mobile"}>
                <Datovelger
                    className={"kol"}
                    name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                    label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap")}
                    maxDate={datoForDoedsfallet || new Date()}
                />

                <Datovelger
                    className={"kol"}
                    name={"forholdTilAvdoede.datoForSkilsmisse"}
                    label={t("omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse")}
                    minDate={datoForInngaattPartnerskap}
                    maxDate={datoForDoedsfallet || new Date()}
                />
            </SkjemaGruppe>

            <RHFSpoersmaalRadio
                name={"forholdTilAvdoede.fellesBarn"}
                legend={t("omDegOgAvdoed.forholdTilAvdoede.fellesBarn")}
            />

            {fellesBarn === IValg.JA && mindreEnn15aar === IValg.JA && (
                <>
                    <RHFSpoersmaalRadio
                        name={"forholdTilAvdoede.samboereMedFellesBarn"}
                        legend={t("omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn")}
                    />

                    {samboereMedFellesBarn === IValg.NEI && merEnn25aar === IValg.NEI && (
                        <SkjemaGruppe>
                            <Alert variant={"warning"}>
                                {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                            </Alert>
                        </SkjemaGruppe>
                    )}
                </>
            )}

            {fellesBarn === IValg.NEI && mindreEnn15aar === IValg.JA && merEnn25aar === IValg.NEI && (
                <SkjemaGruppe>
                    <Alert variant={"warning"}>
                        {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                    </Alert>
                </SkjemaGruppe>
            )}

            {mindreEnnFemAar === IValg.NEI && (
                <>
                    <RHFSpoersmaalRadio
                        name={"forholdTilAvdoede.mottokEktefelleBidrag"}
                        legend={t("omDegOgAvdoed.forholdTilAvdoede.mottokEktefelleBidrag")}
                    />
                    {mottokEktefelleBidrag === IValg.NEI && (
                        <SkjemaGruppe>
                            <Alert variant={"warning"}>
                                {t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}
                            </Alert>
                        </SkjemaGruppe>
                    )}
                </>
            )}
        </>
    );
};

export default SkiltFraAvdoede;
