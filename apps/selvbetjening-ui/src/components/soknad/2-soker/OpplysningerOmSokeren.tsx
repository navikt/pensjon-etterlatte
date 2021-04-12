import React, { useEffect } from "react";
import "./OpplysningerOmSokeren.less";
import { Element, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { hentInnloggetPerson } from "../../../api";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IPerson } from "../../../typer/IPerson";
import { SoeknadActionTypes } from "../../../context/soknad/soknad";
import ToValgRadio from "../../felles/ToValgRadio";
import { Input } from "nav-frontend-skjema";

const OpplysningerOmSokeren: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();

    const { soeker } = state;

    useEffect(() => {
        if (!!soeker) return;

        hentInnloggetPerson().then((person: IPerson) => {
            console.log(person);
            dispatch({ type: SoeknadActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
        });
    }, [soeker, dispatch]);

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel>2 Opplysninger om søkeren</Systemtittel>

            <br />
            <AlertStripe type="advarsel">
                Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.
            </AlertStripe>
            <br />

            {!!soeker && (
                <div className={"opplysninger"}>
                    <section>
                        <Element>Fødselsnummer / d-nummer</Element>
                        <Normaltekst>{soeker.foedselsnummer}</Normaltekst>
                    </section>

                    <section>
                        <Element>Navn</Element>
                        <Normaltekst>
                            {soeker.fornavn} {soeker.etternavn}
                        </Normaltekst>
                    </section>

                    {/* 2.3 */}
                    <section>
                        <Element>Bostedsadresse</Element>
                        <Normaltekst>{soeker.adresse}</Normaltekst>
                    </section>

                    <section>
                        <Element>Sivilstatus</Element>
                        <Normaltekst>{soeker.sivilstatus}</Normaltekst>
                    </section>

                    {/* 2.6 */}
                    <section>
                        <Element>Statsborgerskap</Element>
                        <Normaltekst>{soeker.statsborgerskap}</Normaltekst>
                    </section>
                </div>
            )}

            <ToValgRadio
                label={"Bor du på denne adressen?"}
                checked={state.kontaktinfo?.boadresseBekreftet}
                invert={true}
                onChange={(valgtSvar) => {
                    dispatch({ type: SoeknadActionTypes.BEKREFT_BOADRESSE, payload: valgtSvar });
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
                        type: SoeknadActionTypes.SETT_TELEFON,
                        payload: (e.target as HTMLInputElement).value,
                    });
                }}
            />

            {/* 2.5 */}
            <Input
                label={"E-post"}
                value={state.kontaktinfo?.epost}
                onChange={(e) => {
                    dispatch({
                        type: SoeknadActionTypes.SETT_EPOST,
                        payload: (e.target as HTMLInputElement).value,
                    });
                }}
            />

            {/* 2.7 */}
            <ToValgRadio
                label={"Oppholder du deg i Norge?"}
                checked={state.kontaktinfo?.oppholderSegINorge}
                invert={true}
                onChange={(valgtSvar) => {
                    dispatch({ type: SoeknadActionTypes.OPPHOLD_NORGE, payload: valgtSvar });
                }}
            >
                <Input label={"Oppgi land"} value={""} onChange={() => {}} />
            </ToValgRadio>

            {/* Mulighet for å fylle inn barnets kontonr. */}

            {/*
                    Skal kun være ett felt for kontonr som hentes fra NAV sine systemer.
                    Bruker skal kunne endre kontonr, men må informeres om at vi kun forholder oss til ETT nr.
                */}
        </>
    );
};

export default OpplysningerOmSokeren;
