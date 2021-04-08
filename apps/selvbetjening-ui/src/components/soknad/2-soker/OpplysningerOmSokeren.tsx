import React, { useEffect } from "react";
import "./OpplysningerOmSokeren.less";
import { Panel } from "nav-frontend-paneler";
import { Element, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { hentInnloggetPerson } from "../../../api";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IPerson } from "../../../typer/IPerson";
import { SoknadActionTypes } from "../../../context/soknad/soknad";
import ToValgRadio from "../../felles/ToValgRadio";
import { Input } from "nav-frontend-skjema";

const OpplysningerOmSokeren: SoknadSteg = ({ neste, forrige }) => {
    const { state, dispatch } = useSoknadContext();

    const { søker } = state;

    useEffect(() => {
        if (!!søker) return;

        hentInnloggetPerson().then((person: IPerson) => {
            console.log(person);
            dispatch({ type: SoknadActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
        });
    }, [søker, dispatch]);

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
                    <div className={"opplysninger"}>
                        <section>
                            <Element>Fødselsnummer / d-nummer</Element>
                            <Normaltekst>{søker.fødselsnummer}</Normaltekst>
                        </section>

                        <section>
                            <Element>Navn</Element>
                            <Normaltekst>
                                {søker.fornavn} {søker.etternavn}
                            </Normaltekst>
                        </section>

                        {/* 2.3 */}
                        <section>
                            <Element>Bostedsadresse</Element>
                            <Normaltekst>{søker.adresse}</Normaltekst>
                        </section>

                        <section>
                            <Element>Sivilstatus</Element>
                            <Normaltekst>{søker.sivilstatus}</Normaltekst>
                        </section>

                        {/* 2.6 */}
                        <section>
                            <Element>Statsborgerskap</Element>
                            <Normaltekst>{søker.statsborgerskap}</Normaltekst>
                        </section>
                    </div>
                )}

                <ToValgRadio
                    label={"Bor du på denne adressen?"}
                    checked={state.kontaktinfo?.boadresseBekreftet}
                    invert={true}
                    onChange={(valgtSvar) => {
                        dispatch({ type: SoknadActionTypes.BEKREFT_BOADRESSE, payload: valgtSvar });
                    }}
                >
                    <AlertStripe type="advarsel" form={"inline"}>
                        Du må oppgi riktig adresse til Folkeregisteret for å bruke denne søknaden
                    </AlertStripe>
                </ToValgRadio>

                {/* 2.4 */}
                <Input
                    type={"tel"}
                    label={"Telefonnummer"}
                    value={state.kontaktinfo?.telefonnummer}
                    onChange={(e) => {
                        dispatch({
                            type: SoknadActionTypes.SETT_TELEFON,
                            payload: (e.target as HTMLInputElement).value,
                        });
                    }}
                />

                {/* 2.5 */}
                <Input
                    label={"E-post"}
                    value={state.kontaktinfo?.epost}
                    onChange={(e) => {
                        dispatch({ type: SoknadActionTypes.SETT_EPOST, payload: (e.target as HTMLInputElement).value });
                    }}
                />

                {/* 2.7 */}
                <ToValgRadio
                    label={"Oppholder du deg i Norge?"}
                    checked={state.kontaktinfo?.oppholderSegINorge}
                    invert={true}
                    onChange={(valgtSvar) => {
                        dispatch({ type: SoknadActionTypes.OPPHOLD_NORGE, payload: valgtSvar });
                    }}
                >
                    <Input label={"Oppgi land"} value={""} onChange={() => {}} />
                </ToValgRadio>

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
