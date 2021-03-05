import React, { FC } from "react";
import "../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, Radio, RadioGruppe, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const SoknadType: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
            {/* Steg 1 */}

            {/* Dette kan kanskje være forsiden? Brukeren velger hvilken type søknad, og vi viser deretter nødvendige felter? */}
            <Panel>
                <Systemtittel>1 Hva søker du?</Systemtittel>

                <br />
                <AlertStripe type="info" form="inline">
                    Hvis du søker om stønad til barnetilsyn på grunn av arbeid eller stønad til skolepenger, vil NAV ta
                    kontakt.
                </AlertStripe>
            </Panel>

            <Panel>
                {/* TODO: Checkbox i stedet */}
                <RadioGruppe>
                    <Radio label={"Pensjon-/overgangsstønad"} name="" />
                    <Radio label={"Gjenlevendetillegg i uføretrygden"} name="" />
                    <Radio label={"Barnepensjon"} name="" />
                    <Radio label={"Stønad til barnetilsyn pga. arbeid"} name="" />
                    <Radio label={"Stønad til skolepenger"} name="" />
                </RadioGruppe>

                <SkjemaGruppe>
                    <Input label="Fra dato (dd.mm.åå)" />
                </SkjemaGruppe>
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}

                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default SoknadType;
