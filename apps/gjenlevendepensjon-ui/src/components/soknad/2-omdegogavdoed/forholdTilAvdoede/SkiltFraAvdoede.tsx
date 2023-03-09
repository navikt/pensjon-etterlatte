import { RHFSpoersmaalRadio } from "../../../felles/rhf/RHFRadio";
import Datovelger from "../../../felles/Datovelger";
import { ISoekerOgAvdoed } from "../../../../typer/person";
import { useFormContext } from "react-hook-form";
import { antallAarMellom } from "../../../../utils/dato";
import { IValg } from "../../../../typer/Spoersmaal";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";
import {SkjemaGruppeRad} from "../../../felles/StyledComponents";
import {SkjemaGruppe} from "../../../felles/SkjemaGruppe";
import {SkjemaElement} from "../../../felles/SkjemaElement";

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
    if (antallAarMellomSkillsmisseDodsfall < 5) {
        return IValg.JA;
    }
    return IValg.NEI;
};

const SkiltFraAvdoede = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoekerOgAvdoed>();
    const { state } = useBrukerContext();

    const datoForInngaattPartnerskap: any = watch("forholdTilAvdoede.datoForInngaattPartnerskap");
    const datoForSkilsmisse: any = watch("forholdTilAvdoede.datoForSkilsmisse");
    const datoForDoedsfallet: any = watch("avdoed.datoForDoedsfallet");

    const fellesBarn = watch("forholdTilAvdoede.fellesBarn");

    const mindreEnn15aar = giftMindreEnn15aar(datoForInngaattPartnerskap, datoForSkilsmisse);
    const merEnn25aar = giftMerEnn25aar(datoForInngaattPartnerskap, datoForSkilsmisse);
    const mindreEnnFemAar = mindreEnnFemaarMellomSkillsmisseOgDodsfall(datoForSkilsmisse, datoForDoedsfallet);

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <SkjemaGruppeRad>
                    <Datovelger
                        kol={true}
                        name={"forholdTilAvdoede.datoForInngaattPartnerskap"}
                        label={t("omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap")}
                        minDate={state.foedselsdato}
                        maxDate={datoForDoedsfallet || new Date()}
                    />

                    <Datovelger
                        kol={true}
                        name={"forholdTilAvdoede.datoForSkilsmisse"}
                        label={t("omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse")}
                        minDate={datoForInngaattPartnerskap}
                        maxDate={datoForDoedsfallet || new Date()}
                    />
                </SkjemaGruppeRad>
            </SkjemaElement>

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
                </>
            )}

            {(mindreEnnFemAar === IValg.NEI && merEnn25aar === IValg.JA) ||
            (fellesBarn === IValg.JA && mindreEnn15aar === IValg.NEI && mindreEnnFemAar === IValg.NEI) ? (
                <>
                    <RHFSpoersmaalRadio
                        name={"forholdTilAvdoede.mottokEktefelleBidrag"}
                        legend={t("omDegOgAvdoed.forholdTilAvdoede.mottokEktefelleBidrag")}
                    />
                </>
            ) : null}
        </SkjemaGruppe>
    );
};

export default SkiltFraAvdoede;
