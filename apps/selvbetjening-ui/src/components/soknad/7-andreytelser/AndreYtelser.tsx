import { SyntheticEvent } from "react";
import "../../../App.less";
import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { useAndreYtelserContext } from "../../../context/andreytelser/AndreYtelserContext";
import { AndreYtelserActionTypes as ActionType } from "../../../context/andreytelser/andre-ytelser";
import SoknadSteg from "../../../typer/SoknadSteg";
import ToValgRadio from "../../felles/ToValgRadio";

const AndreYtelser: SoknadSteg = () => {
    const { state, dispatch } = useAndreYtelserContext();

    const update = (event: any, type: ActionType) => {
        dispatch({
            type,
            payload: (event.target as HTMLInputElement).value,
        });
    };

    return (
        <>
            {/* Steg 7 */}
            <Systemtittel>7 Opplysninger om andre ytelser</Systemtittel>

            <SkjemaGruppe>
                <ToValgRadio
                    checked={state.mottarAndreYtelser}
                    label={
                        "Mottar du ytelser til livsopphold fra folketrygden som dagpenger under arbeidsledighet, sykepenger, stønad ved barns og andre nære pårørendes sykdom, arbeidsavklaringspenger, svangerskapspenger, foreldrepenger, AFP, uføretrygd eller alderspensjon?"
                    }
                    onChange={(valgtSvar) => dispatch({ type: ActionType.SET_ANDRE_YTELSER, payload: valgtSvar })}
                />

                <ToValgRadio
                    checked={state.harKravOmAnnenStonad}
                    label={"Har du satt fram krav om annen stønad/pensjon som ikke er avgjort?"}
                    onChange={(valgtSvar) =>
                        dispatch({ type: ActionType.SET_KRAV_OM_ANNEN_STONAD, payload: valgtSvar })
                    }
                >
                    <Input
                        value={state.annenStonadBeskrivelse}
                        label="Hva slags stønad/pensjon?"
                        onChange={(e: SyntheticEvent<EventTarget>) =>
                            update(e, ActionType.SET_ANNEN_STONAD_BESKRIVELSE)
                        }
                    />
                </ToValgRadio>

                <ToValgRadio
                    checked={state.mottarPensjonFraUtlandet}
                    label={"Mottar du pensjon fra utlandet?"}
                    onChange={(valgtSvar) =>
                        dispatch({ type: ActionType.SET_MOTTAR_PENSJON_UTLAND, payload: valgtSvar })
                    }
                >
                    <Input
                        value={state.pensjonUtlandBeskrivelse}
                        label="Hvis ja, hva slags pensjon og fra hvilket land?"
                        onChange={(e: SyntheticEvent<EventTarget>) =>
                            update(e, ActionType.SET_PENSJON_UTLAND_BESKRIVELSE)
                        }
                    />

                    <Input
                        value={state.pensjonUtlandBruttobelop}
                        label="Bruttobeløp pr. år i landets valuta, oppgi landets valuta"
                        onChange={(e: SyntheticEvent<EventTarget>) =>
                            update(e, ActionType.SET_PENSJON_UTLAND_BRUTTOBELOP)
                        }
                    />
                </ToValgRadio>
            </SkjemaGruppe>
        </>
    );
};

export default AndreYtelser;
