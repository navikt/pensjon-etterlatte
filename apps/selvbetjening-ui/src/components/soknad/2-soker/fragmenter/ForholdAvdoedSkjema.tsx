import Panel from "nav-frontend-paneler";
import { ForholdTilAvdoed, ISoeker } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { Undertittel } from "nav-frontend-typografi";
import { useFormContext } from "react-hook-form";
import Datovelger from "../../../felles/Datovelger";
import RHFInput from "../../../felles/RHFInput";
import { RHFToValgRadio, RHFRadio } from "../../../felles/RHFRadio";
import IValg from "../../../../typer/IValg";
import { SkjemaGruppe } from "nav-frontend-skjema";

const ForholdAvoedSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

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
            <SkjemaGruppe>
                <Datovelger
                    name={"forholdTilAvdoed.datoForInngaattPartnerskap"}
                    label={t("omSoekeren.forholdTilAvdoede.datoForPartnerskap")}
                />
            </SkjemaGruppe>

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
                <SkjemaGruppe>
                    <Datovelger
                        name={"forholdTilAvdoed.datoForSkilsmisse"}
                        label={t("omSoekeren.datoForSamlivsbrudd")}
                    />
                </SkjemaGruppe>
            )}

            {/* 2.12 */}
            <RHFToValgRadio
                name={"forholdTilAvdoed.mottokBidragFraAvdoede"}
                legend={t("omSoekeren.mottokBidragFraAvdoede")}
            />

            {mottokBidragFraAvdoede === IValg.JA && (
                <SkjemaGruppe>
                    <RHFInput
                        name={"forholdTilAvdoed.bidragBeloepPrAar"}
                        label={t("omSoekeren.bidragBeloep")}
                        rules={{ pattern: /^\d+$/ }}
                    />
                </SkjemaGruppe>
            )}
        </Panel>
    );
};

export default ForholdAvoedSkjema;
