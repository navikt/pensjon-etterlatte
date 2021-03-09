import React, { FC } from "react";
import "../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Radio, RadioGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const Sprakform: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
            {/* Steg 8 */}
            <Panel>
                <Systemtittel>8 Språkform</Systemtittel>

                <SkjemaGruppe>
                    <RadioGruppe legend="Hvilken språkform ønsker du i svaret?">
                        <Radio label={"Bokmål"} name="" />
                        <Radio label={"Nynorsk (dette er feil svar)"} name="" />
                    </RadioGruppe>
                </SkjemaGruppe>
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default Sprakform;
