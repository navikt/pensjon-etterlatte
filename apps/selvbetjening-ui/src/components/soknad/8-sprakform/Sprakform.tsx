import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { SoknadActionTypes } from "../../../context/soknad/soknad";
import SoknadSteg from "../../../typer/SoknadSteg";

const Sprakform: SoknadSteg = ({ neste, forrige }) => {
    const { state, dispatch } = useSoknadContext();

    function setLanguage(e: any) {
        const target = e.target as HTMLInputElement;

        dispatch({ type: SoknadActionTypes.SET_SPRAK, payload: target.value });
    }

    return (
        <div>
            {/* Steg 8 */}
            <Panel>
                <Systemtittel>8 Språkform</Systemtittel>

                <RadioPanelGruppe
                    name={"language"}
                    legend={"Hvilken språkform ønsker du i svaret?"}
                    radios={[
                        { label: "Bokmål", value: "Bokmål" },
                        { label: "Nynorsk (dette er feil svar)", value: "Nynorsk" },
                    ]}
                    checked={state.sprak}
                    onChange={setLanguage}
                />
            </Panel>

            <Panel>
                <Knapp onClick={forrige}>Tilbake</Knapp>
                <Hovedknapp onClick={neste}>Neste</Hovedknapp>
            </Panel>
        </div>
    );
};

export default Sprakform;
