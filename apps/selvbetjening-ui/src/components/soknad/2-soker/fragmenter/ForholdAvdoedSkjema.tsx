import Panel from "nav-frontend-paneler";
import { ForholdTilAvdoed, ISoeker } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { Undertittel } from "nav-frontend-typografi";
import { useFormContext } from "react-hook-form";
import Datovelger from "../../../felles/Datovelger";
import RHFInput from "../../../felles/RHFInput";
import { RHFToValgRadio, RHFRadio } from "../../../felles/RHFRadio";
import IValg from "../../../../typer/IValg";

const ForholdAvoedSkjema = () => {
    const { t } = useTranslation();

    const {
        control,
        watch,
        formState: { errors }
    } = useFormContext<ISoeker>();

    const forholdTilAvdoede = watch("forholdTilAvdoed.forholdTilAvdoede")
    const varSkiltFoerDoedsfall = watch("forholdTilAvdoed.varSkiltFoerDoedsfall")
    const mottokBidragFraAvdoede = watch("forholdTilAvdoed.mottokBidragFraAvdoede")

    return (
        <Panel border>
            <Undertittel>{t("omSoekeren.forholdTilAvdoede.tittel")}</Undertittel>

            <br />

            <RHFRadio
                name={"forholdTilAvdoed.forholdTilAvdoede"}
                radios={[
                    {
                        label: t("omSoekeren.forholdTilAvdoede.ektefelle"),
                        value: ForholdTilAvdoed.gjenlevendeEktefelle
                    },
                    {
                        label: t("omSoekeren.forholdTilAvdoede.partner"),
                        value: ForholdTilAvdoed.gjenlevendePartner
                    },
                    {
                        label: t("omSoekeren.forholdTilAvdoede.samboer"),
                        value: ForholdTilAvdoed.gjenlevendeSamboer
                    },
                    {
                        label: t("omSoekeren.forholdTilAvdoede.ugift"),
                        value: ForholdTilAvdoed.ugiftMenForsoerget,
                    },
                ]}
            />

            {/* 2.9 */}
            <Datovelger
                name={"forholdTilAvdoed.datoForInngaattPartnerskap"}
                control={control}
                label={t("omSoekeren.forholdTilAvdoede.datoForPartnerskap")}
                feil={errors.forholdTilAvdoed?.datoForInngaattPartnerskap && "Må fylles ut"}
            />

            {/* 2.10 */}
            {forholdTilAvdoede === ForholdTilAvdoed.gjenlevendeSamboer && (
                <RHFToValgRadio
                    name={"forholdTilAvdoed.hattBarnEllerVaertGift"}
                    legend={t("omSoekeren.hattBarnEllerVaertGift")}
                />
            )}

            {/* 2.11 */}
            <RHFToValgRadio
                name={"forholdTilAvdoed.varSkiltFoerDoedsfall"}
                legend={t("omSoekeren.varSkiltFraAvdoede")}
            />

            {varSkiltFoerDoedsfall === IValg.JA && (
                <Datovelger
                    name={"forholdTilAvdoed.datoForSkilsmisse"}
                    control={control}
                    label={t("omSoekeren.datoForSamlivsbrudd")}
                    feil={errors.forholdTilAvdoed?.datoForSkilsmisse && "Må fylles ut"}
                />
            )}

            {/* 2.12 */}
            <RHFToValgRadio
                name={"forholdTilAvdoed.mottokBidragFraAvdoede"}
                legend={t("omSoekeren.mottokBidragFraAvdoede")}
            />

            {mottokBidragFraAvdoede === IValg.JA && (
                <RHFInput
                    name={"forholdTilAvdoed.bidragBeloepPrAar"}
                    label={t("omSoekeren.bidragBeloep")}
                />
            )}
        </Panel>
    );
};

export default ForholdAvoedSkjema;
