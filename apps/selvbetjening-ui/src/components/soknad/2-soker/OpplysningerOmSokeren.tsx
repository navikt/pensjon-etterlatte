import React, { useEffect } from "react";
import "./OpplysningerOmSokeren.less";
import { Element, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import SoknadSteg from "../../../typer/SoknadSteg";
import { hentInnloggetPerson } from "../../../api";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IPdlPerson } from "../../../typer/person";
import { SoeknadActionTypes } from "../../../context/soknad/soknad";
import ToValgRadio from "../../felles/ToValgRadio";
import { Input } from "nav-frontend-skjema";

const OpplysningerOmSokeren: SoknadSteg = () => {
    const { state, dispatch } = useSoknadContext();
    const { opplysningerOmSoekeren } = state;

    useEffect(() => {
        if (!opplysningerOmSoekeren) {
            hentInnloggetPerson().then((person: IPdlPerson) => {
                dispatch({ type: SoeknadActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
            });
        }
    }, [opplysningerOmSoekeren, dispatch]);

    return (
        <>
            {/* Steg 2 */}
            <Systemtittel>2 Opplysninger om søkeren</Systemtittel>

            <br />
            <AlertStripe type="advarsel">
                Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.
            </AlertStripe>
            <br />

            {!!opplysningerOmSoekeren && (
                <div className={"opplysninger"}>
                    <section>
                        <Element>Fødselsnummer / d-nummer</Element>
                        <Normaltekst>{opplysningerOmSoekeren.foedselsnummer}</Normaltekst>
                    </section>

                    <section>
                        <Element>Navn</Element>
                        <Normaltekst>
                            {opplysningerOmSoekeren.navn?.fornavn} {opplysningerOmSoekeren.navn?.etternavn}
                        </Normaltekst>
                    </section>

                    {/* 2.3 */}
                    <section>
                        <Element>Bostedsadresse</Element>
                        <Normaltekst>{opplysningerOmSoekeren.bosted?.adresse}</Normaltekst>
                    </section>

                    <section>
                        <Element>Sivilstatus</Element>
                        <Normaltekst>{opplysningerOmSoekeren.sivilstatus}</Normaltekst>
                    </section>

                    {/* 2.6 */}
                    <section>
                        <Element>Statsborgerskap</Element>
                        <Normaltekst>{opplysningerOmSoekeren.statsborgerskap}</Normaltekst>
                    </section>
                </div>
            )}

            <ToValgRadio
                label={"Bor du på denne adressen?"}
                checked={opplysningerOmSoekeren?.bosted?.boadresseBekreftet}
                invert={true}
                onChange={(valgtSvar) => {
                    dispatch({ type: SoeknadActionTypes.BEKREFT_BOADRESSE, payload: valgtSvar });
                }}
            >
                <AlertStripe type="advarsel" form={"inline"}>
                    Du må oppgi riktig adresse til Folkeregisteret for å bruke denne søknaden
                </AlertStripe>
            </ToValgRadio>

            {/* TODO: */}
            <div style={{ pointerEvents: "none", opacity: ".4" }}>
                {/* 2.4 */}
                <Input
                    type={"tel"}
                    label={"Telefonnummer"}
                    value={opplysningerOmSoekeren?.kontaktinfo?.telefonnummer}
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
                    value={opplysningerOmSoekeren?.kontaktinfo?.epost}
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
                    checked={opplysningerOmSoekeren?.bosted?.oppholderSegINorge}
                    invert={true}
                    onChange={(valgtSvar) => {
                        dispatch({ type: SoeknadActionTypes.OPPHOLD_NORGE, payload: valgtSvar });
                    }}
                >
                    <Input label={"Oppgi land"} value={""} onChange={() => {}} />
                </ToValgRadio>
            </div>

            {/* Mulighet for å fylle inn barnets kontonr. */}

            {/*
                    Skal kun være ett felt for kontonr som hentes fra NAV sine systemer.
                    Bruker skal kunne endre kontonr, men må informeres om at vi kun forholder oss til ETT nr.
                */}
        </>
    );
};

export default OpplysningerOmSokeren;
