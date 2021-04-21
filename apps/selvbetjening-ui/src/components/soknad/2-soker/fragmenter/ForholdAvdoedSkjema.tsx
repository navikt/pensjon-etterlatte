import { Panel } from "nav-frontend-paneler";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import Datovelger from "../../../felles/Datovelger";
import ToValgRadio from "../../../felles/ToValgRadio";
import TekstInput from "../../../felles/TekstInput";
import { IForholdAvdoed } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { Undertittel } from "nav-frontend-typografi";

interface Props {
    forholdTilAvdoed?: IForholdAvdoed;
    setForholdTilAvdoed: (forholdAvdoed: IForholdAvdoed) => void;
}

const ForholdAvoedSkjema = ({ forholdTilAvdoed, setForholdTilAvdoed }: Props) => {
    const { t } = useTranslation();

    return (
        <Panel border>
            <Undertittel>{t("omSoekeren.forholdTilAvdoede.tittel")}</Undertittel>

            <br />

            <RadioPanelGruppe
                name={"forholdTilAvdoede"}
                // legend={t("omSoekeren.forholdTilAvdoede.tittel")}
                radios={[
                    { label: t("omSoekeren.forholdTilAvdoede.ektefelle"), value: "Gjenlevende ektefelle" },
                    { label: t("omSoekeren.forholdTilAvdoede.partner"), value: "Gjenlevende partner" },
                    { label: t("omSoekeren.forholdTilAvdoede.samboer"), value: "Gjenlevende samboer" },
                    {
                        label: t("omSoekeren.forholdTilAvdoede.ugift"),
                        value: "Ugift, men ble forsørget av den avdøde",
                    },
                ]}
                checked={forholdTilAvdoed?.forholdTilAvdoede}
                onChange={(e) =>
                    setForholdTilAvdoed({
                        ...forholdTilAvdoed,
                        forholdTilAvdoede: (e.target as HTMLInputElement).value,
                    })
                }
            />

            {/* 2.9 */}
            <Datovelger
                label={t("omSoekeren.forholdTilAvdoede.datoForPartnerskap")}
                valgtDato={forholdTilAvdoed?.datoForInngaattPartnerskap}
                onChange={(datoForInngaattPartnerskap) =>
                    setForholdTilAvdoed({
                        ...forholdTilAvdoed,
                        datoForInngaattPartnerskap,
                    })
                }
            />

            {/* 2.10 */}
            {forholdTilAvdoed?.forholdTilAvdoede === "Gjenlevende samboer" && (
                <>
                    <ToValgRadio
                        label={t("omSoekeren.hattBarnEllerVaertGift")}
                        checked={forholdTilAvdoed?.hattBarnEllerVaertGift}
                        onChange={(hattBarnEllerVaertGift) =>
                            setForholdTilAvdoed({
                                ...forholdTilAvdoed,
                                hattBarnEllerVaertGift,
                            })
                        }
                    />
                </>
            )}

            {/* 2.11 */}
            <ToValgRadio
                label={t("omSoekeren.varSkiltFraAvdoede")}
                checked={forholdTilAvdoed?.varSkiltFoerDoedsfall}
                onChange={(varSkiltFoerDoedsfall) =>
                    setForholdTilAvdoed({
                        ...forholdTilAvdoed,
                        varSkiltFoerDoedsfall,
                    })
                }
            >
                <Datovelger
                    label={t("omSoekeren.datoForSamlivsbrudd")}
                    valgtDato={forholdTilAvdoed?.datoForSkilsmisse}
                    onChange={(datoForSkilsmisse) => setForholdTilAvdoed({ ...forholdTilAvdoed, datoForSkilsmisse })}
                />
            </ToValgRadio>

            {/* 2.12 */}
            <ToValgRadio
                label={t("omSoekeren.mottokBidragFraAvdoede")}
                checked={forholdTilAvdoed?.mottokBidragFraAvdoede}
                onChange={(mottokBidragFraAvdoede) =>
                    setForholdTilAvdoed({
                        ...forholdTilAvdoed,
                        mottokBidragFraAvdoede,
                    })
                }
            >
                <TekstInput
                    label={t("omSoekeren.bidragBeloep")}
                    value={forholdTilAvdoed?.bidragBeloepPrAar}
                    onChange={(bidragBeloepPrAar) => setForholdTilAvdoed({ ...forholdTilAvdoed, bidragBeloepPrAar })}
                />
            </ToValgRadio>
        </Panel>
    );
};

export default ForholdAvoedSkjema;
