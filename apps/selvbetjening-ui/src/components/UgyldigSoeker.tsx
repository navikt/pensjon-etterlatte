import { useBrukerContext } from "../context/bruker/BrukerContext";
import Veileder from "nav-frontend-veileder";
import ikon from "../assets/ikoner/veileder.svg";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ActionTypes } from "../context/bruker/bruker";
import { erForUng } from "../utils/alder";
import { useHistory } from "react-router-dom";
import { BodyLong, Button, Link } from "@navikt/ds-react";

const UgyldigSoeker = () => {
    const history = useHistory();

    const { state, dispatch } = useBrukerContext();

    if (state.kanSoeke) {
        history.push("/");
    }

    const brukerErForUng = erForUng(state.alder!!);

    const heiTekst = brukerErForUng
        ? "Hei, du kan ikke søke om gjenlevende- eller barnepensjon fordi du er under 18 år."
        : "Hei, du kan ikke søke om gjenlevendepensjon.";

    const tilbake = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL });

        window.location.href = "https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/ytelser-til-gjenlevende-ektefelle"
    };

    return (
        <>
            <SkjemaGruppe>
                {brukerErForUng ? (
                    <Veileder tekst={heiTekst} posisjon="høyre">
                        <img alt="veileder" src={ikon}/>
                    </Veileder>
                ) : (
                    <Veileder tekst={heiTekst} posisjon="høyre">
                        <img alt="veileder" src={ikon}/>
                    </Veileder>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                {brukerErForUng ? (
                    <BodyLong>
                        For å søke om gjenlevendepensjon, eller søke barnepensjon på vegne av et barn, må du være over
                        18 år.
                    </BodyLong>
                ) : (
                    <BodyLong>
                        For å få gjenlevendepensjon må du være mellom 18 og 67 år.
                        Ønsker du å søke om gjenlevendetillegg i alderspensjon? Du kan lese mer om dette på sidene om
                        alderspensjon.
                    </BodyLong>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>
                    {brukerErForUng ? (
                        <Link
                            href={"https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/barnepensjon#chapter-3"}>
                            Her kan du lese mer om hvem som kan få barnepensjon og hvordan du søker.
                        </Link>
                    ) : (
                        <Link href={"https://www.nav.no/no/person/pensjon/alderspensjon"}>
                            Her kan du lese mer om hvem som kan få alderspensjon og hvordan du søker.
                        </Link>
                    )}
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Button variant={"action"} onClick={tilbake}>Tilbake</Button>
                </section>
            </SkjemaGruppe>
        </>
    );
};

export default UgyldigSoeker;
