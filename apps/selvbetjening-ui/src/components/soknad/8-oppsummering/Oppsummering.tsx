import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../../api";
import { useHistory } from "react-router-dom";
import { Ingress, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import React, { useState } from "react";
import { Fareknapp, Hovedknapp } from "nav-frontend-knapper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import OppsummeringAvdoed from "./fragmenter/OppsummeringAvdoed";
import SoknadSteg from "../../../typer/SoknadSteg";
import OppsummeringBarn from "./fragmenter/OppsummeringBarn";
import { default as Modal } from "nav-frontend-modal";
import { ActionTypes } from "../../../context/soknad/soknad";
import AlertStripe from "nav-frontend-alertstriper";
import OppsummeringOmDeg from "./fragmenter/OppsummeringOmDeg";
import Navigasjon from "../../felles/Navigasjon";

const Oppsummering: SoknadSteg = ({ forrige }) => {
    const history = useHistory();
    const { state, dispatch } = useSoknadContext();

    const {
        omDeg,
        omDenAvdoede,
        opplysningerOmBarn,
    } = state;

    const [isOpen, setIsOpen] = useState(false);

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

    const avbrytSoeknad = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL })

        window.location.href = "https://www.nav.no"
    }

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

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                closeButton={true}
                contentLabel={"aasdfsdf"}
            >
                <SkjemaGruppe>
                    <Ingress>
                        Er du helt sikker på at du vil avbryte søknaden?
                    </Ingress>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Hovedknapp htmlType={"button"} onClick={() => setIsOpen(false)}>
                        Nei, jeg vil fortsette søknaden
                    </Hovedknapp>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Fareknapp htmlType={"button"} onClick={avbrytSoeknad}>
                        Ja, avbryt søknaden
                    </Fareknapp>
                </SkjemaGruppe>
            </Modal>

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
