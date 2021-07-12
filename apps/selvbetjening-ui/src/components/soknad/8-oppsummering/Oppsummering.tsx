import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../../api";
import { useHistory } from "react-router-dom";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import React, { useState } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import OppsummeringAvdoed from "./fragmenter/OppsummeringAvdoed";
import SoknadSteg from "../../../typer/SoknadSteg";
import OppsummeringBarn from "./fragmenter/OppsummeringBarn";
import AlertStripe from "nav-frontend-alertstriper";
import OppsummeringOmDeg from "./fragmenter/OppsummeringOmDeg";
import Navigasjon from "../../felles/Navigasjon";

const Oppsummering: SoknadSteg = ({ forrige }) => {
    const history = useHistory();
    const { state } = useSoknadContext();

    const {
        omDeg,
        omDenAvdoede,
        opplysningerOmBarn,
    } = state;

    const [senderSoeknad, setSenderSoeknad] = useState(false);
    const [error, setError] = useState(false);

    const send = () => {
        setSenderSoeknad(true);

        sendSoeknad(state)
            .then((soknadId) => {
                history.push(`/soknad/sendt/${soknadId}`);
            })
            .catch((error) => {
                console.log(error)
                setSenderSoeknad(false);
                setError(true)
            });
    };

    return (
        <>
            <SkjemaGruppe>
                <Systemtittel className={"center"}>Oppsummering</Systemtittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>Les gjennom oppsummeringen av din søknad før du sender.</Normaltekst>
                <Normaltekst>Hvis du trenger å gjøre endringer, kan du gå tilbake og gjøre det. </Normaltekst>
            </SkjemaGruppe>

            <OppsummeringOmDeg state={omDeg!!} />

            <OppsummeringAvdoed state={omDenAvdoede!!} />

            <OppsummeringBarn state={opplysningerOmBarn} />

            <br />

            {error && (
                <SkjemaGruppe>
                    <AlertStripe type={"feil"}>
                        En feil oppsto ved sending. Vent litt og prøv på nytt. Dersom feilen vedvarer kan du kontakte kundeservice.
                    </AlertStripe>
                </SkjemaGruppe>
            )}

            <Navigasjon
                forrige={forrige}
                send={send}
                disabled={senderSoeknad}
            />
        </>
    );
};

export default Oppsummering;
