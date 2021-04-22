import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../api";
import { useHistory } from "react-router-dom";
import { Panel } from "nav-frontend-paneler";
import { Element, Normaltekst, Undertittel } from "nav-frontend-typografi";
import React from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { IValg } from "../../typer/ISpoersmaal";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";

const SoknadOppsummering = () => {
    const history = useHistory();

    // const { t } = useTranslation();
    const { state } = useSoknadContext();

    const {
        stoenadType,
        opplysningerOmSoekeren,
        // opplysningerOmDenAvdoede,
        // opplysningerOmBarn,
        // tidligereArbeidsforhold,
        // naavaerendeArbeidsforhold,
        // andreYtelser
    } = state;

    const send = () => {
        sendSoeknad(state)
            .then((r) => {
                console.log(r);

                history.push("/soknad/sendt");
            })
            .catch((error) => {
                // TODO: Håndtere feil. Redirect til feilside?
                console.error(error);
            });
    };

    const stoenader = [
        stoenadType?.etterlatte && "Etterlatte",
        stoenadType?.gjenlevendetillegg && "Gjenlevendetillegg",
        stoenadType?.barnepensjon && "Barnepensjon",
        stoenadType?.barnetilsyn && "Barnetilsyn",
        stoenadType?.skolepenger && "Skolepenger",
    ];

    return (
        <>
            <h1 className="typo-sidetittel">Oppsummering</h1>
            <br />

            <AlertStripe type={"advarsel"}>UTKAST! Venter på endelig design.</AlertStripe>
            <br />

            <Panel border className={"opplysninger"}>
                <Undertittel>{stoenader.length > 1 ? "Valgte stønader" : "Valgt stønad"}</Undertittel>
                <br />

                <section>
                    {stoenader.map((type, i) => {
                        return <Normaltekst key={i}>{type}</Normaltekst>;
                    })}
                </section>
                <br />

                <section>
                    <Element>Fra dato</Element>
                    <Normaltekst>{stoenadType?.fraDato}</Normaltekst>
                </section>
            </Panel>
            <br />

            <Panel border className={"opplysninger"}>
                <Undertittel>Opplysninger om søkeren</Undertittel>
                <br />

                <section>
                    <Element>Telefonnummer</Element>
                    <Normaltekst>{opplysningerOmSoekeren?.kontaktinfo?.telefonnummer}</Normaltekst>
                </section>
                <br />

                <section>
                    <Element>E-post</Element>
                    <Normaltekst>{opplysningerOmSoekeren?.kontaktinfo?.epost}</Normaltekst>
                </section>
                <br />

                <section>
                    <Element>Kontonummer</Element>
                    <Normaltekst>{opplysningerOmSoekeren?.kontonummer}</Normaltekst>
                </section>
                <br />

                <section>
                    <Element>Oppholder seg i Norge</Element>
                    <Normaltekst>{opplysningerOmSoekeren?.oppholderSegINorge}</Normaltekst>
                </section>
                <br />

                {opplysningerOmSoekeren?.oppholderSegINorge === IValg.NEI && (
                    <>
                        <section>
                            <Element>Oppholdsland</Element>
                            <Normaltekst>{opplysningerOmSoekeren?.oppholdsland}</Normaltekst>
                        </section>
                        <br />

                        <section>
                            <Element>Medlem folketrygden</Element>
                            <Normaltekst>{opplysningerOmSoekeren?.medlemFolketrygdenUtland}</Normaltekst>
                        </section>
                        <br />
                    </>
                )}
            </Panel>
            <br />

            <Ekspanderbartpanel tittel="Vis søknad JSON">
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </Ekspanderbartpanel>
            <br />

            <AlertStripe type="info">Klikk send søknad hvis alt ser OK ut... osv</AlertStripe>
            <br />

            <section className={"navigasjon-rad"}>
                <Knapp onClick={() => history.push("/soknad/steg/0")}>Tilbake</Knapp>
                <Hovedknapp onClick={send}>Send søknad</Hovedknapp>
            </section>
        </>
    );
};

export default SoknadOppsummering;
