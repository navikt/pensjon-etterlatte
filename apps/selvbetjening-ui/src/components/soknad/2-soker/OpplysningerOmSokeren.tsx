import React from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";

const OpplysningerOmSokeren: SoknadSteg = ({ neste, forrige }) => {
    return (
        <div>
            {/* Steg 2 */}
            <Panel>
                <Systemtittel>2 Opplysninger om søkeren</Systemtittel>

                <br />
                <AlertStripe type="advarsel">
                    Hvis forhåndsutfylt, og den forhåndsutfylte informasjonen ikke stemmer, kontakt folkeregisteret
                </AlertStripe>
                <br />

                <SkjemaGruppe>
                    <Input label="Fornavn" />
                    <Input label="Etternavn" />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    {/* Denne kan trolig sløyfes siden brukeren er innlogget */}
                    <Input label="Fødselsnummer (11 siffer)" />
                </SkjemaGruppe>

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
