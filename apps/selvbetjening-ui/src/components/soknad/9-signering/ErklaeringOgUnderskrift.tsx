import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import Tekstomrade from "nav-frontend-tekstomrade";
import { Checkbox } from "nav-frontend-skjema";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { SoknadActionTypes } from "../../../context/soknad/soknad";
import SoknadSteg from "../../../typer/SoknadSteg";

const ErklaeringOgUnderskrift: SoknadSteg = ({ neste, forrige }) => {
    const { state, dispatch } = useSoknadContext();

    function handleChange(e: any) {
        const target = e.target as HTMLInputElement;

        dispatch({ type: SoknadActionTypes.SET_BEKREFTET, payload: target.checked });
    }

    return (
        <div>
            {/* Steg 9 */}
            <Panel>
                <Systemtittel>9 Erklæring og underskrift</Systemtittel>

                <Tekstomrade>
                    Jeg er kjent med at NAV kan innhente de opplysningene som er nødvendige for å avgjøre søknaden. Jeg
                    bekrefter at opplysningene er gitt etter beste skjønn og overbevisning og så fullstendig som det har
                    vært mulig.
                </Tekstomrade>
                <Checkbox label={"Checkbox"} onChange={handleChange} checked={state.bekreftet} />

                {/* Dato og sjekkboks-verdi må sendes. Kanskje backend burde ta av seg dato? */}
            </Panel>

            <Panel>
                <Knapp onClick={forrige}>Tilbake</Knapp>
                <Hovedknapp onClick={neste}>Neste</Hovedknapp>
            </Panel>
        </div>
    );
};

export default ErklaeringOgUnderskrift;
