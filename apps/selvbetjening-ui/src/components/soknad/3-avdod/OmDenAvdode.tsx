import "../../../App.less";
import { FnrInput, Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { useAvdodContext } from "../../../context/avdod/AvdodContext";
import { AvdodActionTypes as ActionType } from "../../../context/avdod/avdod";
import SoknadSteg from "../../../typer/SoknadSteg";
import ToValgRadio from "../../felles/ToValgRadio";
import React, { SyntheticEvent } from "react";
import Datovelger from "../../felles/Datovelger";

const OmDenAvdode: SoknadSteg = () => {
    const { state, dispatch } = useAvdodContext();

    const oppdater = (type: ActionType, payload: string) => {
        dispatch({ type, payload });
    };

    const oppdaterInput = (type: ActionType, e: SyntheticEvent) => {
        dispatch({ type, payload: (e.target as HTMLInputElement).value });
    };

    const oppdaterFnr = (e: SyntheticEvent) => {
        const value = (e.target as HTMLInputElement).value;
        const fnr = value.replace(/[^\d]+/g, "");

        dispatch({ type: ActionType.SET_AVDOD_FNR, payload: fnr });
    };

    return (
        <>
            {/* Steg 3 */}
            <Systemtittel>3 Opplysninger om den avdøde</Systemtittel>
            <br />

            <SkjemaGruppe>
                {/* 3.1 */}
                <Input
                    label="Fornavn"
                    value={state.fornavn}
                    onChange={(e) => oppdaterInput(ActionType.SET_AVDOD_FORNAVN, e)}
                />

                <Input
                    label="Etternavn"
                    value={state.etternavn}
                    onChange={(e) => oppdaterInput(ActionType.SET_AVDOD_ETTERNAVN, e)}
                />

                {/* 3.2 */}
                <FnrInput
                    label="Fødselsnummer (11 siffer)"
                    value={state.fnr}
                    type={"tel"}
                    maxLength={11}
                    onChange={oppdaterFnr}
                    onValidate={
                        (valid) => {
                            console.log(`is valid: ${valid}`);
                        } /*setValid(val)*/
                    }
                    // feil={ ? "Ugyldig fødselsnummer" : undefined}
                />

                {/* 3.3 */}
                <Datovelger
                    label={"Dødsdato"}
                    valgtDato={state.doedsdato}
                    onChange={(valgtDato) => dispatch({ type: ActionType.SET_AVDOD_DODSDATO, payload: valgtDato })}
                />

                {/* 3.4 */}
                <Input
                    label="Statsborgerskap"
                    value={state.statsborgerskap}
                    onChange={(e) => oppdaterInput(ActionType.SET_AVDOD_STATSBORGERSKAP, e)}
                />

                {/* 3.5 fjernes. Ikke lenger gyldig. */}
                <br />
                <br />
                {/* 3.6 */}
                <ToValgRadio
                    checked={state.bosetning}
                    label={"Var den avdøde bosatt i Norge sammenhengende siste tre år før dødsfallet?"}
                    onChange={(valgtSvar) => oppdater(ActionType.SET_AVDOD_BOSETNING, valgtSvar)}
                />
                <br />

                {/* 3.7 */}
                <ToValgRadio
                    // name={"dodsfallArsak"}
                    checked={state.doedsfallAarsak}
                    label={"Kan dødesfallet være en følge av yrkesskade/yrkessykdom?"}
                    onChange={(valgtSvar) => oppdater(ActionType.SET_AVDOD_DODSFALL_ARSAK, valgtSvar)}
                />
                <br />

                {/* 3.8 */}
                <ToValgRadio
                    // name={"avdodBoddEllerJobbetUtland"}
                    checked={state.boddEllerJobbetUtland}
                    label={"Hadde den avdøde bodd eller arbeidet i utlandet etter fylte 16 år?"}
                    onChange={(valgtSvar) => oppdater(ActionType.SET_AVDOD_BODD_ELLER_JOBBET_UTLAND, valgtSvar)}
                />
                {/* 3.9 Info om arbeidsforhold og inntekt hvis JA over */}
                <br />

                {/* 3.10 */}
                <ToValgRadio
                    // name={"pensjonsgivendeInntekt"}
                    checked={state.haddePensjonsgivendeInntekt}
                    label={
                        "Hadde den avdøde pensjonsgivende inntekt (arbeidsinntekt eller næringsinntekt) på tidspunktet før dødsfallet?"
                    }
                    onChange={(valgtSvar) => oppdater(ActionType.SET_AVDOD_PENSJONSGIVEDE_INNTEKT, valgtSvar)}
                >
                    <Input
                        label="Oppgi bruttobeløp pr. år (kr)"
                        value={state.pensjonsgivendeInntektSvar}
                        onChange={(valgtSvar) =>
                            oppdaterInput(ActionType.SET_AVDOD_PENSJONSGIVEDE_INNTEKT_SVAR, valgtSvar)
                        }
                    />
                </ToValgRadio>
                <br />

                {/* 3.11 Samme som over ?! */}

                {/* 3.12 */}
                <ToValgRadio
                    // name={"pensjonAndreLand"}
                    checked={state.haddePensjonAndreLand}
                    label={"Mottok den avdøde pensjon fra andre land enn Norge?"}
                    onChange={(valgtSvar) => oppdater(ActionType.SET_AVDOD_PENSJON_ANDRE_LAND, valgtSvar)}
                >
                    <Input
                        label="Oppgi bruttobeløp pr. år (kr)"
                        value={state.pensjonAndreLandSvar}
                        onChange={(valgtSvar) => oppdaterInput(ActionType.SET_AVDOD_PENSJON_ANDRE_LAND_SVAR, valgtSvar)}
                    />
                </ToValgRadio>
                <br />

                {/* 3.13 */}
                <ToValgRadio
                    // name={"militaerTjeneste"}
                    checked={state.harAvtjentMilitaerTjeneste}
                    label={
                        "Har den avdøde etter 1966 avtjent militær eller sivil førstegangstjeneste som varte minst 30 dager?"
                    }
                    onChange={(valgtSvar) => oppdater(ActionType.SET_AVDOD_MILITAER_TJENESTE, valgtSvar)}
                >
                    <Input
                        label="Oppgi årstall"
                        value={state.avtjentMilitaerTjenesteSvar}
                        onChange={(valgtSvar) => oppdaterInput(ActionType.SET_AVDOD_MILITAER_TJENESTE_SVAR, valgtSvar)}
                    />
                </ToValgRadio>
            </SkjemaGruppe>
            <br />
        </>
    );
};

export default OmDenAvdode;
