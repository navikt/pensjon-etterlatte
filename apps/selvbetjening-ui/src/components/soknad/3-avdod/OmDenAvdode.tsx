import { FC } from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { FnrInput, Input, RadioPanelGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";
import { useAvdodContext } from "../../../context/avdod/AvdodContext";
import { AvdodActionTypes as ActionType } from "../../../context/avdod/avdod";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const OmDenAvdode: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    const { state, dispatch } = useAvdodContext();

    return (
        <div className="app">
            {/* Steg 3 */}
            <Panel>
                <Systemtittel>3 Opplysninger om den avdøde</Systemtittel>
                <br />

                <SkjemaGruppe>
                    {/* 3.1 */}
                    <Input
                        label="Fornavn"
                        value={state.fornavn}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_FORNAVN,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />

                    <Input
                        label="Etternavn"
                        value={state.etternavn}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_ETTERNAVN,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />

                    {/* 3.2 */}
                    <FnrInput
                        label="Fødselsnummer (11 siffer)"
                        // bredde="L"
                        value={state.fnr}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_FNR,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                        onValidate={() => {} /*setValid(val)*/}
                        // feil={submit && !valid ? "Ugyldig fødselsnummer" : undefined}
                    />

                    {/* 3.3 */}
                    <Input
                        label="Dødsdato (dd.mm.åå)"
                        value={state.dodsdato}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_DODSDATO,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />

                    {/* 3.4 */}
                    <Input
                        label="Statsborgerskap"
                        value={state.statsborgerskap}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_STATSBORGERSKAP,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />

                    {/* 3.5 fjernes. Ikke lenger gyldig. */}

                    <br />
                    <br />
                    {/* 3.6 */}
                    <RadioPanelGruppe
                        name={"avdodBosetning"}
                        legend={"Var den avdøde bosatt i Norge sammenhengende siste tre år før dødsfallet?"}
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.bosetning}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_BOSETNING,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />
                    <br />

                    {/* 3.7 */}
                    <RadioPanelGruppe
                        name={"dodsfallArsak"}
                        legend={"Kan dødesfallet være en følge av yrkesskade/yrkessykdom?"}
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.dodsfallAarsak}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_DODSFALL_ARSAK,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />
                    <br />

                    {/* 3.8 */}
                    <RadioPanelGruppe
                        name={"avdodBoddEllerJobbetUtland"}
                        legend={"Hadde den avdøde bodd eller arbeidet i utlandet etter fylte 16 år?"}
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.boddEllerJobbetUtland}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_BODD_ELLER_JOBBET_UTLAND,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />
                    {/* 3.9 Info om arbeidsforhold og inntekt hvis JA over */}
                    <br />

                    {/* 3.10 */}
                    <RadioPanelGruppe
                        name={"pensjonsgivendeInntekt"}
                        legend={
                            "Hadde den avdøde pensjonsgivende inntekt (arbeidsinntekt eller næringsinntekt) på tidspunktet før dødsfallet?"
                        }
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.pensjonsgivendeInntekt}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_PENSJONSGIVEDE_INNTEKT,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />
                    {state.pensjonsgivendeInntekt === "Ja" && <Input label="Oppgi bruttobeløp pr. år (kr)" />}
                    <br />

                    {/* 3.11 Samme som over ?! */}

                    {/* 3.12 */}
                    <RadioPanelGruppe
                        name={"pensjonAndreLand"}
                        legend={"Mottok den avdøde pensjon fra andre land enn Norge?"}
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.pensjonAndreLand}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_PENSJON_ANDRE_LAND,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />
                    {state.pensjonAndreLand === "Ja" && <Input label="Oppgi bruttobeløp pr. år (kr)" />}
                    <br />

                    {/* 3.13 */}
                    <RadioPanelGruppe
                        name={"militaerTjeneste"}
                        legend={
                            "Har den avdøde etter 1966 avtjent militær eller sivil førstegangstjeneste som varte minst 30 dager?"
                        }
                        radios={[
                            { label: "Ja", value: "Ja" },
                            { label: "Nei", value: "Nei" },
                        ]}
                        checked={state.militaerTjeneste}
                        onChange={(e) => {
                            dispatch({
                                type: ActionType.SET_AVDOD_MILITAER_TJENESTE,
                                payload: (e.target as HTMLInputElement).value,
                            });
                        }}
                    />
                    {state.militaerTjeneste === "Ja" && <Input label="Oppgi årstall" />}
                    <br />
                </SkjemaGruppe>
                <br />
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default OmDenAvdode;
