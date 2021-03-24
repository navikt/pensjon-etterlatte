import { SyntheticEvent } from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useAndreYtelserContext } from "../../../context/andreytelser/AndreYtelserContext";
import { AndreYtelserActionTypes as ActionType } from "../../../context/andreytelser/andre-ytelser";
import SoknadSteg from "../../../typer/SoknadSteg";

const AndreYtelser: SoknadSteg = ({ neste, forrige }) => {
    const { state, dispatch } = useAndreYtelserContext();

    const update = (event: any, type: ActionType) => {
        dispatch({
            type,
            payload: (event.target as HTMLInputElement).value,
        });
    };

    return (
        <div>
            {/* Steg 7 */}
            <Panel>
                <Systemtittel>7 Opplysninger om andre ytelser</Systemtittel>

                <SkjemaGruppe>
                    <RadioPanelGruppe
                        name={"andreYtelser"}
                        legend={
                            "Mottar du ytelser til livsopphold fra folketrygden som dagpenger under arbeidsledighet, sykepenger, stønad ved barns og andre nære pårørendes sykdom, arbeidsavklaringspenger, svangerskapspenger, foreldrepenger, AFP, uføretrygd eller alderspensjon?"
                        }
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.mottarAndreYtelser}
                        onChange={(e: SyntheticEvent<EventTarget>) => update(e, ActionType.SET_ANDRE_YTELSER)}
                    />

                    <RadioPanelGruppe
                        name={"kravOmAnnenStonad"}
                        legend={"Har du satt fram krav om annen stønad/pensjon som ikke er avgjort?"}
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.harKravOmAnnenStonad}
                        onChange={(e: SyntheticEvent<EventTarget>) => update(e, ActionType.SET_KRAV_OM_ANNEN_STONAD)}
                    />
                    {state.harKravOmAnnenStonad === "Ja" && (
                        <Input
                            value={state.annenStonadBeskrivelse}
                            label="Hva slags stønad/pensjon?"
                            onChange={(e: SyntheticEvent<EventTarget>) =>
                                update(e, ActionType.SET_ANNEN_STONAD_BESKRIVELSE)
                            }
                        />
                    )}

                    <RadioPanelGruppe
                        name={"mottarPensjonFraUtlandet"}
                        legend={"Mottar du pensjon fra utlandet?"}
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.mottarPensjonFraUtlandet}
                        onChange={(e: SyntheticEvent<EventTarget>) => update(e, ActionType.SET_MOTTAR_PENSJON_UTLAND)}
                    />
                    {state.mottarPensjonFraUtlandet === "Ja" && (
                        <>
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
                        </>
                    )}
                </SkjemaGruppe>
            </Panel>

            <Panel>
                <Knapp onClick={forrige}>Tilbake</Knapp>
                <Hovedknapp onClick={neste}>Neste</Hovedknapp>
            </Panel>
        </div>
    );
};

export default AndreYtelser;
