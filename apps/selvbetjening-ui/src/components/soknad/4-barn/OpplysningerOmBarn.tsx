import React, { FC } from "react";
import "../../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, Radio, RadioGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const OpplysningerOmBarn: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
            {/* Steg 4 */}
            <Panel>
                <Systemtittel>4 Opplysninger om barn</Systemtittel>

                <SkjemaGruppe>
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
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default OpplysningerOmBarn;
