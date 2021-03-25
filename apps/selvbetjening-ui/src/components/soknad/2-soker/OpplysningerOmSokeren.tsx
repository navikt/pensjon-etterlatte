import React, { useEffect } from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Element, Ingress, Normaltekst, Systemtittel, Undertittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { hentInnloggetPerson } from "../../../api";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import IPerson from "../../../typer/IPerson";
import { SoknadActionTypes } from "../../../context/soknad/soknad";
import ToValgRadio from "../../felles/ToValgRadio";

const OpplysningerOmSokeren: SoknadSteg = ({ neste, forrige }) => {
    const { state, dispatch } = useSoknadContext();

    const { søker } = state;

    useEffect(() => {
        if (!!søker) return;

        hentInnloggetPerson().then((person: IPerson) => {
            console.log(person);
            dispatch({ type: SoknadActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
        });
    });

    return (
        <div>
            {/* Steg 2 */}
            <Panel>
                <Systemtittel>2 Opplysninger om søkeren</Systemtittel>

                <br />
                <AlertStripe type="advarsel">
                    Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.
                </AlertStripe>
                <br />

                {!!søker && (
                    <>
                        <section>
                            <Undertittel>Fødselsnummer / d-nummer</Undertittel>
                            <Ingress>{søker.fødselsnummer}</Ingress>
                        </section>

                        <section>
                            <Element>Navn</Element>
                            <Normaltekst>
                                {søker.fornavn} {søker.etternavn}
                            </Normaltekst>
                        </section>

                        <section>
                            <Element>Adresse</Element>
                            <Normaltekst>{søker.adresse}</Normaltekst>
                        </section>

                        <section>
                            <Element>Sivilstatus</Element>
                            <Normaltekst>{søker.sivilstatus}</Normaltekst>
                        </section>

                        <section>
                            <Element>Statsborgerskap</Element>
                            <Normaltekst>{søker.statsborgerskap}</Normaltekst>
                        </section>
                    </>
                )}

                <ToValgRadio
                    checked={"Ja"}
                    legend={"Bor du på denne adressen?"}
                    onChange={(e) => {
                        console.log(e);
                    }}
                />

                {/* Mulighet for å fylle inn barnets kontonr. */}

                {/*
                    Skal kun være ett felt for kontonr som hentes fra NAV sine systemer.
                    Bruker skal kunne endre kontonr, men må informeres om at vi kun forholder oss til ETT nr.
                */}
            </Panel>

            <Panel>
                <Knapp onClick={forrige}>Tilbake</Knapp>
                <Hovedknapp onClick={neste}>Neste</Hovedknapp>
            </Panel>
        </div>
    );
};

export default OpplysningerOmSokeren;
