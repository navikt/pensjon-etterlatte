import React, { FC } from "react";
import "../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const OpplysningerOmSokeren: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
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
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default OpplysningerOmSokeren;
