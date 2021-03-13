import React, { FC } from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Fareknapp, Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";
import { useTidligereArbeidsforholdContext } from "../../../context/tidligerearbeidsforhold/TidlArbeidsforholdContext";
import { TidlArbActionTypes } from "../../../context/tidligerearbeidsforhold/tidligere-arbeidsforhold";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const TidligereArbeidsforhold: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    const { state, dispatch } = useTidligereArbeidsforholdContext();

    return (
        <div className="app">
            {/* Steg 4 */}
            <Panel>
                <Systemtittel>5 Opplysninger om søkers tidligere arbeidsforhold</Systemtittel>

                {state.liste.map((item: any, index: number) => {
                    return (
                        <SkjemaGruppe key={index}>
                            <Input
                                value={item.beskrivelse}
                                bredde={"XXL"}
                                label="Skoler utover grunnskolen, yrkesrettede kurs o.l. og tidligere arbeidsforhold"
                                onChange={(e) => {
                                    dispatch({
                                        type: TidlArbActionTypes.OPPDATER_BESKRIVELSE,
                                        payload: { index, value: (e.target as HTMLInputElement).value },
                                    });
                                }}
                            />
                            <Input
                                value={item.varighet}
                                bredde={"XXL"}
                                label="Varighet"
                                onChange={(e) => {
                                    dispatch({
                                        type: TidlArbActionTypes.OPPDATER_VARIGHET,
                                        payload: { index, value: (e.target as HTMLInputElement).value },
                                    });
                                }}
                            />

                            <Fareknapp onClick={() => dispatch({ type: TidlArbActionTypes.FJERN, payload: index })}>
                                Fjern
                            </Fareknapp>

                            <hr />
                        </SkjemaGruppe>
                    );
                })}

                <br />
                <Knapp onClick={() => dispatch({ type: TidlArbActionTypes.LEGG_TIL_NY })}>+ Legg til</Knapp>
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default TidligereArbeidsforhold;
