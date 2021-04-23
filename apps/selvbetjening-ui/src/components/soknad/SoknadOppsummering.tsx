import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../api";
import { useHistory } from "react-router-dom";
import { Panel } from "nav-frontend-paneler";
import { Sidetittel } from "nav-frontend-typografi";
import React from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp } from "nav-frontend-knapper";

const SoknadOppsummering = () => {
    const history = useHistory();
    const soeknad = useSoknadContext().state;

    const send = () => {
        sendSoeknad(soeknad)
            .then((r) => {
                console.log(r);

                history.push("/soknad/sendt");
            })
            .catch((error) => {
                // TODO: Håndtere feil. Redirect til feilside?
                console.error(error);
            });
    };

    // Mulighet for å hoppe til steg ved eventuell endring
    //

    return (
        <Panel>
            <Sidetittel>Oppsummering</Sidetittel>

            <pre>{JSON.stringify(soeknad, null, 2)}</pre>

            <AlertStripe type="info">Klikk send søknad hvis alt ser OK ut... osv</AlertStripe>

            <section className={"navigasjon-rad"}>
                <Hovedknapp onClick={send}>Send søknad</Hovedknapp>
            </section>
        </Panel>
    );
};

export default SoknadOppsummering;
