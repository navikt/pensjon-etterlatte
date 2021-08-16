import { useBrukerContext } from "../context/bruker/BrukerContext";
import Veileder from "nav-frontend-veileder";
import ikon from "../assets/ikoner/veileder.svg";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";
import { Hovedknapp } from "nav-frontend-knapper";
import { ActionTypes } from "../context/bruker/bruker";
import Lenke from "nav-frontend-lenker";
import { hentAlder } from "../utils/dato";
import { erForUng } from "../utils/alder";

const UgyldigSoeker = () => {
    const { state, dispatch } = useBrukerContext();

    const alder = hentAlder(state.foedselsdato!!);
    const brukerErForUng = erForUng(alder);

    const heiTekst = brukerErForUng
        ? "Hei, du kan ikke søke om gjenlevende- eller barnepensjon fordi du er under 18 år."
        : "Hei, du kan dessverre ikke søke om gjenlevendepensjon";

    const tilbake = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL });

        window.location.href = "https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/ytelser-til-gjenlevende-ektefelle"
    }

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
                    <Normaltekst>
                        For å søke om gjenlevendepensjon, eller søke barnepensjon på vegne av et barn, må du være over 18 år.
                    </Normaltekst>
                ) : (
                    <Normaltekst>
                        For å få gjenlevendepensjon må du være mellom 18 og 67 år.
                        Ønsker du å søke om gjenlevendetillegg i alderspensjon? Du kan lese mer om dette på sidene om alderspensjon.
                    </Normaltekst>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>
                    {brukerErForUng ? (
                        <Lenke href={"https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/barnepensjon#chapter-3"}>
                            Her kan du lese mer om hvem som kan få barnepensjon og hvordan du søker.
                        </Lenke>
                    ) : (
                        <Lenke href={"https://www.nav.no/no/person/pensjon/alderspensjon"}>
                            Her kan du lese mer om hvem som kan få alderspensjon og hvordan du søker.
                        </Lenke>
                    )}
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Hovedknapp onClick={tilbake}>Tilbake</Hovedknapp>
                </section>
            </SkjemaGruppe>
        </>
    )
}

export default UgyldigSoeker;
