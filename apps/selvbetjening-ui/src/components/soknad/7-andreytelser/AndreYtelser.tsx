import { useEffect, useState } from "react";
import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import ToValgRadio from "../../felles/ToValgRadio";
import { IAndreYtelser, ActionTypes } from "../../../context/soknad/soknad";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import TekstInput from "../../felles/TekstInput";
import { useTranslation } from "react-i18next";

const AndreYtelser: SoknadSteg = () => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();
    const { andreYtelser } = state;

    const initialState: IAndreYtelser = andreYtelser || {
        mottarAndreYtelser: undefined,
        kravOmAnnenStonad: {
            svar: undefined,
            beskrivelseAvStoenad: "",
        },
        mottarPensjonUtland: {
            svar: undefined,
            hvaSlagsPensjon: "",
            fraHvilketLand: "",
            bruttobeloepPrAar: "",
            landetsValuta: "",
        },
    };

    const [ytelser, setYtelser] = useState(initialState);

    useEffect(() => {
        dispatch({ type: ActionTypes.OPPDATER_ANDRE_YTELSER, payload: ytelser });
    }, [ytelser, dispatch]);

    return (
        <>
            {/* Steg 7 */}
            <Systemtittel>{t("andreYtelser.tittel")}</Systemtittel>

            <SkjemaGruppe>
                <ToValgRadio
                    checked={ytelser.mottarAndreYtelser}
                    label={t("andreYtelser.mottarAndreYtelser")}
                    onChange={(mottarAndreYtelser) => setYtelser({ ...ytelser, mottarAndreYtelser })}
                />

                <ToValgRadio
                    checked={ytelser.kravOmAnnenStonad.svar}
                    label={t("andreYtelser.kravOmAnnenStonad")}
                    onChange={(svar) =>
                        setYtelser({
                            ...ytelser,
                            kravOmAnnenStonad: { ...ytelser.kravOmAnnenStonad, svar },
                        })
                    }
                >
                    <TekstInput
                        value={ytelser.kravOmAnnenStonad.beskrivelseAvStoenad}
                        label={t("andreYtelser.beskrivelseAvAnnenStoenad")}
                        onChange={(beskrivelseAvStoenad) =>
                            setYtelser({
                                ...ytelser,
                                kravOmAnnenStonad: { ...ytelser.kravOmAnnenStonad, beskrivelseAvStoenad },
                            })
                        }
                    />
                </ToValgRadio>

                <ToValgRadio
                    checked={ytelser.mottarPensjonUtland.svar}
                    label={t("andreYtelser.mottarPensjonUtland")}
                    onChange={(svar) =>
                        setYtelser({
                            ...ytelser,
                            mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, svar },
                        })
                    }
                >
                    <TekstInput
                        value={ytelser.mottarPensjonUtland.hvaSlagsPensjon}
                        label={t("andreYtelser.hvaSlagsPensjon")}
                        onChange={(hvaSlagsPensjon) =>
                            setYtelser({
                                ...ytelser,
                                mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, hvaSlagsPensjon },
                            })
                        }
                    />

                    <TekstInput
                        value={ytelser.mottarPensjonUtland.fraHvilketLand}
                        label={t("andreYtelser.mottarFraLand")}
                        onChange={(fraHvilketLand) =>
                            setYtelser({
                                ...ytelser,
                                mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, fraHvilketLand },
                            })
                        }
                    />

                    <TekstInput
                        value={ytelser.mottarPensjonUtland.bruttobeloepPrAar}
                        label={t("andreYtelser.bruttobeloep")}
                        onChange={(bruttobeloepPrAar) =>
                            setYtelser({
                                ...ytelser,
                                mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, bruttobeloepPrAar },
                            })
                        }
                    />

                    <TekstInput
                        value={ytelser.mottarPensjonUtland.landetsValuta}
                        label={t("andreYtelser.landetsValuta")}
                        onChange={(landetsValuta) =>
                            setYtelser({
                                ...ytelser,
                                mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, landetsValuta },
                            })
                        }
                    />
                </ToValgRadio>
            </SkjemaGruppe>
        </>
    );
};

export default AndreYtelser;
