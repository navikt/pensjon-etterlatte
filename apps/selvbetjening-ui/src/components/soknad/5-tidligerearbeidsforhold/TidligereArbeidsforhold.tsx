import React from "react";
import "../../../App.less";
import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Fareknapp, Knapp } from "nav-frontend-knapper";
import { useTidligereArbeidsforholdContext } from "../../../context/tidligerearbeidsforhold/TidlArbeidsforholdContext";
import { TidlArbActionTypes } from "../../../context/tidligerearbeidsforhold/tidligere-arbeidsforhold";
import SoknadSteg from "../../../typer/SoknadSteg";

const TidligereArbeidsforhold: SoknadSteg = () => {
    const { state, dispatch } = useTidligereArbeidsforholdContext();

    return (
        <>
            {/* TODO: Kun relevant hvis "skolepenger" */}
            {/* TODO: Kun relevant hvis IKKE i arbeid, eks. hvis student. */}
            {/* Steg 4 */}

            <Systemtittel>5 Opplysninger om søkers tidligere arbeidsforhold</Systemtittel>

            {state.liste.map((item: any, index: number) => {
                return (
                    <SkjemaGruppe key={index}>
                        <Input
                            value={item.beskrivelse}
                            label={"Skoler utover grunnskolen, yrkesrettede kurs o.l. og tidligere arbeidsforhold"}
                            onChange={(e) => {
                                dispatch({
                                    type: TidlArbActionTypes.OPPDATER_BESKRIVELSE,
                                    payload: { index, value: (e.target as HTMLInputElement).value },
                                });
                            }}
                        />
                        <Input
                            value={item.varighet}
                            label={"Varighet"}
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
        </>
    );
};

export default TidligereArbeidsforhold;
