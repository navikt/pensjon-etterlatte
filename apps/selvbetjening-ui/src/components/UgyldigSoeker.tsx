import { useBrukerContext } from "../context/bruker/BrukerContext";
import Veileder from "nav-frontend-veileder";
import ikon from "../assets/ikoner/veileder.svg";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";
import { Hovedknapp } from "nav-frontend-knapper";
import { ActionTypes } from "../context/bruker/bruker";
import Lenke from "nav-frontend-lenker";

const UgyldigSoeker = () => {
    const { dispatch } = useBrukerContext();

    const tilbake = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL });

        window.location.href = "https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/ytelser-til-gjenlevende-ektefelle"
    }

    return (
        <>
            <SkjemaGruppe>
                <Veileder tekst={"Hei, du kan dessverre ikke søke om gjenlevendepensjon"} posisjon="høyre">
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>
                    For å få gjenlevendepensjon må du være mellom 18 og 66 år.
                </Normaltekst>

                <Normaltekst>
                    <Lenke href={""}>
                        Les mer om hvem som kan søke.
                    </Lenke>
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
