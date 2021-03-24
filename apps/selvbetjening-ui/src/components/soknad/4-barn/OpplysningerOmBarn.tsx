import React from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, Radio, RadioGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import SoknadSteg from "../../../typer/SoknadSteg";

const OpplysningerOmBarn: SoknadSteg = ({ neste, forrige }) => {
    return (
        <div>
            {/* Steg 4 */}
            <Panel>
                <Systemtittel>4 Opplysninger om barn</Systemtittel>

                <SkjemaGruppe>
                    {/* sjekkboks for INGEN BARN */}

                    <Input label="Fornavn" />
                    <Input label="Etternavn" />
                    <Input label="Fødselsnummer (11 siffer)" />

                    <RadioGruppe>
                        <Radio label={"Fellesbarn m/avdøde"} name="" />
                        <Radio label={"Avdødes særkullsbarn"} name="" />
                        <Radio label={"Egne særkullsbarn"} name="" />
                    </RadioGruppe>

                    <RadioGruppe legend="Bor barnet i utlandet?">
                        <Radio label={"Ja"} name="" />
                        <Radio label={"Nei"} name="" />
                    </RadioGruppe>

                    <Input label=" Hvis ja, oppgi statsborgerskap og land." />
                </SkjemaGruppe>

                <br />
                <Knapp>+ Legg til barn</Knapp>
            </Panel>

            <Panel>
                <Knapp onClick={forrige}>Tilbake</Knapp>
                <Hovedknapp onClick={neste}>Neste</Hovedknapp>
            </Panel>
        </div>
    );
};

export default OpplysningerOmBarn;
