import "./SoknadForside.less";
import Lenke from "nav-frontend-lenker";
import { Ingress, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import Veileder from "nav-frontend-veileder";
import ikon from "../../assets/ikoner/veileder.svg";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import { useEffect } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { useParams } from "react-router";
import AlertStripe from "nav-frontend-alertstriper";

interface KvitteringProps {
    id: string;
}

const SoknadKvittering = () => {
    const { id } = useParams<KvitteringProps>();

    const { dispatch } = useSoknadContext();

    useEffect(() => {
        dispatch({ type: ActionTypes.TILBAKESTILL });
    }, [dispatch])

    return (
        <div className={"forside"}>
            <SkjemaGruppe className={"center"}>
                <Veileder>
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe className={"center"}>
                <Systemtittel>Takk for søknaden</Systemtittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                {/* TODO: Fikse dato */}
                <AlertStripe type={"suksess"}>
                    Søknaden din om etterlatteytelser er mottatt [klokkeslett, dato]
                </AlertStripe>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Ingress>
                    Saksnummer: <b>{id}</b>
                </Ingress>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>
                    Spørsmålene i søknaden, sammen med eventuell dokumentasjon, gir oss svar på det vi trenger for å
                    behandle søknaden din. Dersom vi har behov for mer infromasjon vil vi ta kontakt med deg.
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Systemtittel>Se saken i Ditt NAV</Systemtittel>

                <Normaltekst>
                    Ved å logge inn i <Lenke href={"#"}>Ditt NAV</Lenke> finner du en bekreftelse på at søknaden din er
                    sendt inn. Når vi starter å behandle søknaden din, kan du finne den i <Lenke href={"#"}>Dine
                    saker</Lenke>.
                </Normaltekst>

                <Normaltekst>
                    <Lenke href={"#"}>Last ned kvitteringen</Lenke>
                    <br/>
                    <Lenke href={"#"}>Skriv ut kvitteringen</Lenke>
                </Normaltekst>

                <Normaltekst>
                    Saken din behandles manuelt. Du kan forvente at det tar xxx - xxx tid å behandle den. Finn
                    <Lenke href={"#"}>saksbehandlingstiden</Lenke> for ditt fylke.
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Systemtittel>
                    Når du er etterlatt med barn og i arbeid, kan du ha rett til andre stønader
                </Systemtittel>

                <Normaltekst>
                    Hvis du er i arbeid, har barn, eller er under utdanning, kan du også ha rett til andre stønader.
                </Normaltekst>

                <Normaltekst>
                    <ul>
                        <li>Utvidet barnetrygd</li>
                        <li>Stønad til barnetilsyn</li>
                        <li>Stønad til skolepenger</li>
                        <li>Stønad til gravferd</li>
                        <li>... andre ting?</li>
                    </ul>
                    <Lenke href={"#"}>
                        Les mer om stønader du kan ha rett på
                    </Lenke>
                </Normaltekst>

                <Knapp onClick={() => {
                }}>
                    Søk tilleggsstønader
                </Knapp>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Systemtittel>
                    Lurer du på noe?
                </Systemtittel>

                <Normaltekst>
                    Har du spørsmål eller noe er uklart kan du alltids ta kontakt med oss.
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Hovedknapp onClick={() => (window.location.href = "https://www.nav.no")}>Avslutt</Hovedknapp>
                </section>
            </SkjemaGruppe>
        </div>
    );
};

export default SoknadKvittering;
