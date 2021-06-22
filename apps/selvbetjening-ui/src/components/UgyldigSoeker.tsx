import { useBrukerContext } from "../context/bruker/BrukerContext";
import { hentAlder } from "../utils/Utils";
import Veileder from "nav-frontend-veileder";
import ikon from "../assets/ikoner/veileder.svg";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Normaltekst, Sidetittel } from "nav-frontend-typografi";
import { Hovedknapp } from "nav-frontend-knapper";
import { ActionTypes } from "../context/bruker/bruker";

const UgyldigSoeker = () => {
    const { state, dispatch } = useBrukerContext();

    // TODO: Flytte  ?
    const MAKS_ALDER = 67;
    const MIN_ALDER = 18;

    const alder = hentAlder(state.foedselsdato!!)

    const avslutt = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL });

        window.location.href = "https://www.nav.no"
    }

    return (
        <>
            <SkjemaGruppe>
                <Veileder tekst={"Du kan dessverre ikke søke"} posisjon="høyre">
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                {alder < MIN_ALDER && (
                    <Sidetittel>Søker for ung</Sidetittel>
                )}
                {alder > MAKS_ALDER && (
                    <Sidetittel>Søker for gammel</Sidetittel>
                )}

                <Normaltekst>
                    Grunnet alderskrav kan du dessverre ikke søke. For å være kvalifisert til å motta gjenlevendepensjon
                    må søkeren være mellom 18 og 67 år.
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Hovedknapp onClick={avslutt}>Avslutt</Hovedknapp>
                </section>
            </SkjemaGruppe>
        </>
    )
}

export default UgyldigSoeker;
