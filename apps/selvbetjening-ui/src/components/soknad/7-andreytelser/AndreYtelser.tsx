import { useState } from "react";
import "../../../App.less";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import SoknadSteg from "../../../typer/SoknadSteg";
import ToValgRadio from "../../felles/ToValgRadio";
import { IAndreYtelser, SoeknadActionTypes } from "../../../context/soknad/soknad";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import TekstInput from "../../felles/TekstInput";

const AndreYtelser: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();
    const { andreYtelser } = state;

    const initialState: IAndreYtelser = andreYtelser || {
        mottarAndreYtelser: "",
        kravOmAnnenStonad: {
            svar: "",
            beskrivelseAvStoenad: "",
        },
        mottarPensjonUtland: {
            svar: "",
            hvaSlagsPensjon: "",
            fraHvilketLand: "",
            bruttobeloepPrAar: "",
            landetsValuta: "",
        },
    };

    const [ytelser, setYtelser] = useState(initialState);

    const updateState = () => dispatch({ type: SoeknadActionTypes.OPPDATER_ANDRE_YTELSER, payload: ytelser });

    return (
        <>
            {/* Steg 7 */}
            <Systemtittel>7 Opplysninger om andre ytelser</Systemtittel>

            <SkjemaGruppe onBlur={updateState}>
                <ToValgRadio
                    checked={ytelser.mottarAndreYtelser}
                    label={
                        "Mottar du ytelser til livsopphold fra folketrygden som dagpenger under arbeidsledighet, sykepenger, stønad ved barns og andre nære pårørendes sykdom, arbeidsavklaringspenger, svangerskapspenger, foreldrepenger, AFP, uføretrygd eller alderspensjon?"
                    }
                    onChange={(mottarAndreYtelser) => setYtelser({ ...ytelser, mottarAndreYtelser })}
                />

                <ToValgRadio
                    checked={ytelser.kravOmAnnenStonad.svar}
                    label={"Har du satt fram krav om annen stønad/pensjon som ikke er avgjort?"}
                    onChange={(svar) =>
                        setYtelser({
                            ...ytelser,
                            kravOmAnnenStonad: { ...ytelser.kravOmAnnenStonad, svar },
                        })
                    }
                >
                    <TekstInput
                        value={ytelser.kravOmAnnenStonad.beskrivelseAvStoenad}
                        label="Hva slags stønad/pensjon?"
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
                    label={"Mottar du pensjon fra utlandet?"}
                    onChange={(svar) =>
                        setYtelser({
                            ...ytelser,
                            mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, svar },
                        })
                    }
                >
                    <TekstInput
                        value={ytelser.mottarPensjonUtland.hvaSlagsPensjon}
                        label="Hva slags pensjon?"
                        onChange={(hvaSlagsPensjon) =>
                            setYtelser({
                                ...ytelser,
                                mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, hvaSlagsPensjon },
                            })
                        }
                    />

                    <TekstInput
                        value={ytelser.mottarPensjonUtland.fraHvilketLand}
                        label="Fra hvilket land?"
                        onChange={(fraHvilketLand) =>
                            setYtelser({
                                ...ytelser,
                                mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, fraHvilketLand },
                            })
                        }
                    />

                    <TekstInput
                        value={ytelser.mottarPensjonUtland.bruttobeloepPrAar}
                        label="Bruttobeløp pr. år i landets valuta"
                        onChange={(bruttobeloepPrAar) =>
                            setYtelser({
                                ...ytelser,
                                mottarPensjonUtland: { ...ytelser.mottarPensjonUtland, bruttobeloepPrAar },
                            })
                        }
                    />

                    <TekstInput
                        value={ytelser.mottarPensjonUtland.landetsValuta}
                        label="Oppgi landets valuta"
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
