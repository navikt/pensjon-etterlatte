import "./SoknadForside.less";
import Panel from "nav-frontend-paneler";
import Lenke from "nav-frontend-lenker";
import { Normaltekst, Sidetittel } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import Veileder from "nav-frontend-veileder";
import ikon from "../../assets/ikoner/veileder.svg";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import { useEffect } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";

const SoknadSendt = () => {
    const { dispatch } = useSoknadContext();

    useEffect(() => {
        dispatch({ type: ActionTypes.TILBAKESTILL });
    })

    return (
        <Panel className={"forside"}>
            <SkjemaGruppe>
                <Veileder tekst="Søknaden er sendt!" posisjon="høyre">
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Sidetittel>Takk for din søknad!</Sidetittel>

                <Normaltekst>
                    <p>Din søknad er nå sendt og vil bli behandlet ila. 2-3 uker.</p>

                    <Lenke href={"#"}>Les mer om behandling av søknad her.</Lenke>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Knapp onClick={() => (window.location.href = "https://www.nav.no")}>Avslutt</Knapp>
                </section>
            </SkjemaGruppe>
        </Panel>
    );
};

export default SoknadSendt;
