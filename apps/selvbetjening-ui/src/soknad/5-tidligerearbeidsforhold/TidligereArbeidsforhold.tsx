import React, { FC } from "react";
import "../../App.less";
import { Panel } from "nav-frontend-paneler";
import { Input, SkjemaGruppe } from "nav-frontend-skjema";
import { Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { useHistory } from "react-router-dom";

interface Props {
    forrigeSteg?: number;
    nesteSteg?: number;
}

const TidligereArbeidsforhold: FC<Props> = ({ forrigeSteg, nesteSteg }) => {
    const history = useHistory();

    return (
        <div className="app">
            {/* Steg 4 */}
            <Panel>
                <Systemtittel>5 Opplysninger om søkers tidligere arbeidsforhold</Systemtittel>

                <SkjemaGruppe>
                    <Input label="Skoler utover grunnskolen, yrkesrettede kurs o.l. og tidligere arbeidsforhold" />
                    <Input label="Varighet" />
                </SkjemaGruppe>

                <br />
                <Knapp>+ Legg til</Knapp>
            </Panel>

            <Panel>
                {forrigeSteg && <Knapp onClick={() => history.push(`/soknad/steg/${forrigeSteg}`)}>Tilbake</Knapp>}
                {nesteSteg && <Hovedknapp onClick={() => history.push(`/soknad/steg/${nesteSteg}`)}>Neste</Hovedknapp>}
            </Panel>
        </div>
    );
};

export default TidligereArbeidsforhold;
