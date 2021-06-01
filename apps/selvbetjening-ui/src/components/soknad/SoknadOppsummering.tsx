import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../api";
import { useHistory } from "react-router-dom";
import Panel from "nav-frontend-paneler";
import { Element, Normaltekst, Undertittel } from "nav-frontend-typografi";
import React from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import IValg from "../../typer/IValg";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { ActionTypes } from "../../context/soknad/soknad";

const SoknadOppsummering = () => {
    const history = useHistory();

    // const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const {
        // stoenadType,
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

                dispatch({ type: ActionTypes.TILBAKESTILL })

                history.push("/soknad/sendt");
            })
            .catch((error) => {
                // TODO: Håndtere feil. Redirect til feilside?
                console.error(error);
            });
    };

    // const valgteYtelser = stoenadType?.valgteYtelser!!;
    // const barnepensjonValgt = !!valgteYtelser.barnepensjon && valgteYtelser.barnepensjon === IValg.JA;
    // const harValgtFlereYtelser = !!valgteYtelser.hovedytelse && barnepensjonValgt;

    return (
        <>
            <h1 className="typo-sidetittel">Oppsummering</h1>
            <br />

            <AlertStripe type={"advarsel"}>UTKAST! Venter på endelig design.</AlertStripe>
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
