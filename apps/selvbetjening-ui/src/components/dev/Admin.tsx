import { ActionTypes as SoknadActionTypes } from "../../context/soknad/soknad";
import { Fareknapp, Hovedknapp } from "nav-frontend-knapper";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { useState } from "react";
import Panel from "nav-frontend-paneler";
import AlertStripe from "nav-frontend-alertstriper";
import { useHistory } from "react-router-dom";

const Admin = () => {
    const history = useHistory();

    const { dispatch } = useSoknadContext();

    const [state, setState] = useState<{
        mocked: boolean;
        reset: boolean;
    }>({
        mocked: false,
        reset: false
    });

    const mockSoeknad = () => {
        dispatch({ type: SoknadActionTypes.MOCK_SOEKNAD });

        setState({...state, mocked: true});

        setTimeout(() => {
            history.push("/soknad/steg/oppsummering")
        }, 3500)
    }

    const tilbakestill = () => {
        dispatch({ type: SoknadActionTypes.TILBAKESTILL })

        setState({...state, reset: true});

        setTimeout(() => {
            setState({...state, reset: false});
        }, 3500)
    }

    return (
        <Panel>
            <div className={"navigasjon-rad"}>
                <Hovedknapp onClick={mockSoeknad}>
                    Mock Søknad
                </Hovedknapp>

                <Fareknapp onClick={tilbakestill}>
                    Tilbakestill søknad
                </Fareknapp>
            </div>

            {state.mocked && (
                <AlertStripe type={"suksess"}>
                    Søknad mocket! Tar deg til oppsummering ...
                </AlertStripe>
            )}

            {state.reset && (
                <AlertStripe type={"advarsel"}>
                    Søknad tilbakestilt!
                </AlertStripe>
            )}
        </Panel>
    )
}

export default Admin;
